const sequelize = require("../../config/sequelize");
const AssetCategory = require("../../models/asset-category.model");
const AssetHistory = require("../../models/asset-history.model");
const Asset = require("../../models/asset.model");

const home = async (req, res) => {
  const process = {
    ...(req.query.process && { type: req.query.process }),
    ...(req.query.message && { message: req.query.message }),
  };
  const data = {};
  try {
    const assets = await Asset.findAll({
      include: [{ model: AssetCategory, as: "category", attributes: ["id", "name"] }],
    });

    data.scrappedAssets = assets.filter((asset) => asset.status === "scrapped");
    data.inStockAssets = assets.filter((asset) => asset.status === "in stock");
  } catch (error) {
    process.type = "fail";
    process.message = "Error retrieving data";
  } finally {
    res.render("assets/scrap/home", { data, process });
  }
};

const getForm = async (req, res) => {
  const { id } = req.params;

  try {
    const asset = await Asset.findByPk(id, {
      where: { status: "in stock" },
      include: [{ model: AssetCategory, as: "category", attributes: ["id", "name"] }],
    });
    if (!asset) {
      const process = { type: "fail", message: "Asset not found / in use" };
      return res.redirect(`/assets/scrap?process=${process.type}&message=${process.message}`);
    }

    return res.render("assets/scrap/form", { data: asset });
  } catch (error) {
    const process = { type: "fail", message: "Error occured" };
    return res.redirect(`/assets/scrap?process=${process.type}&message=${process.message}`);
  }
};

const scrapAsset = async (req, res) => {
  const { id } = req.params;
  const { scrap } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const asset = await Asset.findByPk(id, { where: { status: "in stock" } });
    if (!asset || scrap !== "scrap") {
      const process = { type: "fail", message: "Asset not found / in use" };
      return res.redirect(`/assets/scrap?process=${process.type}&message=${process.message}`);
    }

    asset.status = "scrapped";
    await asset.save({ transaction });

    await AssetHistory.create(
      {
        assetId: asset.id,
        action: "scrap",
      },
      { transaction }
    );

    transaction.commit();
    const process = { type: "success", message: "Asset scrapped" };
    return res.redirect(`/assets/scrap?process=${process.type}&message=${process.message}`);
  } catch (error) {
    transaction.rollback();
    const process = { type: "fail", message: "Error occured" };
    return res.redirect(`/assets/scrap?process=${process.type}&message=${process.message}`);
  }
};

module.exports = { home, getForm, scrapAsset };
