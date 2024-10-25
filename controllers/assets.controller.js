const { Op } = require("sequelize");
const Asset = require("../models/asset.model");
const sequelize = require("../config/sequelize");
const AssetHistory = require("../models/asset-history.model");

const getAll = async (req, res) => {
  try {
    const assets = await Asset.findAll({ where: { status: { [Op.ne]: "scrapped" } } });
    res.json({ message: "Asset data retrieved successfully", data: assets });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving data" });
  }
};

const get = async (req, res) => {
  const { id } = req.params;
  try {
    const asset = await Asset.findOne({ where: { id, status: { [Op.ne]: "scrapped" } } });
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.json({ message: "Asset data retrieved successfully", data: asset });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving data" });
  }
};

const create = async (req, res) => {
  const { name, serialNumber, uniqueId, make, model, purchaseDate, value, branch, assetCategoryId } = req.body;
  if (!name || !serialNumber || !uniqueId || !make || !model || !purchaseDate || !value || !branch)
    return res.status(400).json({ message: "Invalid/incomplete data provided" });

  const assetCategoryId_ = assetCategoryId ? assetCategoryId : null;

  const data = {
    name,
    serialNumber,
    uniqueId,
    make,
    model,
    purchaseDate,
    value,
    branch,
    assetCategoryId: assetCategoryId_,
  };

  const t = await sequelize.transaction();
  const newAsset = await Asset.create(data, { transaction: t });

  await AssetHistory.create(
    {
      assetId: newAsset.id,
      action: "purchase",
    },
    { transaction: t }
  );

  await t.commit();
  try {
    res.json({ message: "New asset added successfully", data: newAsset });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Error while storing data" });
  }
};

const update = async (req, res) => {
  const { name, serialNumber, uniqueId, make, model, purchaseDate, value, branch, assetCategoryId } = req.body;
  const { id } = req.params;

  try {
    const asset = await Asset.findOne({ where: { id, status: { [Op.ne]: "scrapped" } } });
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    name && (asset.name = name);
    serialNumber && (asset.serialNumber = serialNumber);
    uniqueId && (asset.uniqueId = uniqueId);
    make && (asset.make = make);
    model && (asset.model = model);
    purchaseDate && (asset.purchaseDate = purchaseDate);
    value && (asset.value = value);
    branch && (asset.branch = branch);
    assetCategoryId && (asset.assetCategoryId = assetCategoryId);

    await asset.save();

    res.json({ message: "Asset data updated successfully", data: asset });
  } catch (error) {
    res.status(500).json({ message: "Error while updating data" });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const numOfAffectedRows = await Asset.destroy({ where: { id, status: { [Op.ne]: "scrapped" } } });

    if (numOfAffectedRows < 1) return res.status(404).json({ message: "Asset not found" });
    res.json({ message: "Asset data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting data" });
  }
};

const issueAsset = async (req, res) => {
  const { id } = req.params;
  const { employeeId } = req.body;

  const t = await sequelize.transaction();
  try {
    const asset = await Asset.findByPk(id);

    if (!asset || asset.status !== "in stock") {
      return res.status(404).json({ message: "Asset not available or already in use" });
    }

    asset.status = "issued";
    await asset.save({ transaction: t });

    await AssetHistory.create(
      {
        assetId: asset.id,
        action: "issue",
        employeeId,
      },
      { transaction: t }
    );

    await t.commit();
    res.json({ message: "Asset data updated successfully", data: asset });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Error while updating data" });
  }
};

const returnAsset = async (req, res) => {
  const { id } = req.params;
  const { employeeId, reason } = req.body;

  const t = await sequelize.transaction();
  try {
    const asset = await Asset.findByPk(id, { transaction: t });
    if (!asset || asset.status !== "issued") return res.status(404).json({ message: "Asset was not issued" });

    // Use transactions
    asset.status = "in stock";
    await asset.save({ transaction: t });

    await AssetHistory.create(
      {
        assetId: asset.id,
        action: "return",
        employeeId,
        reason,
      },
      { transaction: t }
    );

    await t.commit();
    res.json({ message: "Asset data updated successfully", data: asset });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Error while updating data" });
  }
};

const scrapAsset = async (req, res) => {
  const { id } = req.params;

  const t = await sequelize.transaction();

  try {
    const asset = await Asset.findByPk(id, { transaction: t });
    if (!asset || asset.status === "scrapped") return res.status(404).json({ message: "Asset already scrapped or not found" });

    asset.status = "scrapped";
    await asset.save({ transaction: t });

    await AssetHistory.create(
      {
        action: "scrap",
        assetId: asset.id,
      },
      { transaction: t }
    );

    await t.commit();
    res.json({ message: "Asset data updated successfully", data: asset });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Error while updating data" });
  }
};

const assetHistory = async (req, res) => {
  const { id } = req.params;

  try {
    const assetHistory = await AssetHistory.findAll({
      where: {
        assetId: id,
      },
    });
    if (!assetHistory[0]) return res.status(404).json({ message: "Asset history not found" });
    res.json({ message: "Asset history retrieved", data: assetHistory });
  } catch (error) {
    res.status(500).json({ message: "Error while retrieving data" });
  }
};

module.exports = { getAll, get, create, update, remove, issueAsset, returnAsset, scrapAsset, assetHistory };
