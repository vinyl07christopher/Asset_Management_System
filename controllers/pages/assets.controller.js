const { Op, Sequelize } = require("sequelize");
const Asset = require("../../models/asset.model");
const sequelize = require("../../config/sequelize");
const AssetHistory = require("../../models/asset-history.model");
const AssetCategory = require("../../models/asset-category.model");
const createAssetSchema = require("../../joi/assets/createSchema");
const updateAssetSchema = require("../../joi/assets/updateSchema");
const Employee = require("../../models/employee.model");

const home = async (req, res) => {
  const process = {
    ...(req.query.process && { type: req.query.process }),
    ...(req.query.message && { message: req.query.message }),
  };
  const data = {};

  try {
    const assets = await Asset.findAll({
      include: [
        {
          model: AssetCategory,
          as: "category",
          attributes: ["id", "name"],
        },
        { model: Employee, as: "employee", attributes: ["id", "name"] },
      ],
    });

    data.count = {
      inStock: assets.filter((asset) => asset.status === "in stock").length || 0,
      issued: assets.filter((asset) => asset.status === "issued").length || 0,
      scrapped: assets.filter((asset) => asset.status === "scrapped").length || 0,
    };

    data.assets = assets.filter((asset) => asset.status !== "scrapped");
    data.count.usable = data.assets.length || 0;
  } catch (error) {
    process.type = "fail";
    process.message = "Error retrieving data";
  } finally {
    res.render("assets/home", { data, process });
  }
};

const newForm = async (req, res) => {
  let categories = [];
  try {
    categories = await AssetCategory.findAll({ attributes: ["id", "name"] });
  } finally {
    res.render("assets/form", { type: "new", categories });
  }
};

const editForm = async (req, res) => {
  const { id } = req.params;
  try {
    const asset = await Asset.findOne({ where: { id, status: { [Op.ne]: "scrapped" } } });
    if (!asset) {
      const process = { type: "fail", message: "Asset not found" };
      return res.redirect(`/assets?process=${process.type}&message=${process.message}`);
    }
    const categories = await AssetCategory.findAll({ attributes: ["id", "name"] });

    res.render("assets/form", { type: "edit", data: asset, categories });
  } catch (error) {
    const process = { type: "fail", message: "Error occured" };
    return res.redirect(`/assets?process=${process.type}&message=${process.message}`);
  }
};

const create = async (req, res) => {
  const { error, value } = createAssetSchema.validate(req.body);
  const t = await sequelize.transaction();
  try {
    if (error) {
      const errors = error.details.reduce((acc, detail) => {
        const field = detail.path[0];
        acc[field] = detail.message;
        return acc;
      }, {});

      const categories = await AssetCategory.findAll({ attributes: ["id", "name"] });

      return res.render("assets/form", {
        data: req.body,
        errors,
        type: "new",
        categories,
        process: { type: "fail", message: "Invalid/incomplete data provided" },
      });
    }

    const newAsset = await Asset.create(value, { transaction: t });

    await AssetHistory.create(
      {
        assetId: newAsset.id,
        action: "purchase",
      },
      { transaction: t }
    );

    await t.commit();

    const process = { type: "success", message: "Asset added successfully" };
    res.redirect(`/assets?process=${process.type}&message=${process.message}`);
  } catch (error) {
    await t.rollback();
    const categories = await AssetCategory.findAll({ attributes: ["id", "name"] });
    const process = { type: "fail", message: "Error occured" };
    if (error instanceof Sequelize.UniqueConstraintError) {
      process.message = "Duplicate entry, data already exists";
      return res.render("assets/form", { type: "new", categories, data: req.body, process, error: process.message });
    }

    res.render("assets/form", {
      data: req.body,
      type: "new",
      categories,
      process,
    });
  }
};

const update = async (req, res) => {
  const { id } = req.params;

  try {
    const asset = await Asset.findOne({ where: { id, status: { [Op.ne]: "scrapped" } } });
    if (!asset) {
      const process = { type: "fail", message: "Asset not found" };
      return res.redirect(`/assets?process=${process.type}&message=${process.message}`);
    }

    const { error, value } = updateAssetSchema.validate(req.body);
    if (error) {
      const errors = error.details.reduce((acc, detail) => {
        const field = detail.path[0];
        acc[field] = detail.message;
        return acc;
      }, {});

      const categories = await AssetCategory.findAll({ attributes: ["id", "name"] });

      return res.render("assets/form", {
        data: { ...req.body, id },
        errors,
        type: "edit",
        categories,
        process: { type: "fail", message: "Invalid/incomplete data provideds" },
      });
    }

    await asset.update(value);

    const process = { type: "success", message: "Asset updated successfully" };
    res.redirect(`/assets?process=${process.type}&message=${process.message}`);
  } catch (error) {
    const categories = await AssetCategory.findAll({ attributes: ["id", "name"] });

    res.render("assets/form", {
      data: req.body,
      type: "edit",
      categories,
      process: { type: "fail", message: "Error occured" },
    });
  }
};

const assetHistoryHome = async (req, res) => {
  const process = {
    ...(req.query.process && { type: req.query.process }),
    ...(req.query.message && { message: req.query.message }),
  };
  try {
    const assets = await Asset.findAll({
      include: [
        {
          model: AssetCategory,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: Employee,
          as: "employee",
          attributes: ["id", "name"],
        },
      ],
    });
    res.render("assets/history/home", { data: { assets }, process });
  } catch (error) {
    const process = { type: "fail", message: "Error occured" };
    res.render("assets/history/home", { data: {}, process });
  }
};

const assetHistory = async (req, res) => {
  const { id } = req.params;

  try {
    const asset = await Asset.findByPk(id, { include: [{ model: AssetCategory, as: "category", attributes: ["name"] }] });

    if (!asset) return res.redirect(`/assets/history?process=fail&message=Asset not found`);

    const assetHistory = await AssetHistory.findAll({
      where: {
        assetId: id,
      },
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["id", "name"],
        },
      ],
    });

    res.render("assets/history/history", { data: { asset, assetHistory } });
  } catch (error) {
    return res.redirect(`/assets/history?process=fail&message=Error while retrieving data`);
  }
};

module.exports = {
  home,
  newForm,
  editForm,
  create,
  update,

  assetHistoryHome,
  assetHistory,
};
