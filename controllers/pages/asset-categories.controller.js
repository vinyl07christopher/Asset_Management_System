const Joi = require("joi");
const AssetCategory = require("../../models/asset-category.model");
const { Sequelize } = require("sequelize");

const home = async (req, res) => {
  const data = {};
  const process = {
    ...(req.query.process && { type: req.query.process }),
    ...(req.query.message && { message: req.query.message }),
  };

  try {
    data.assetCategories = await AssetCategory.findAll();
  } catch (error) {
    process.type = "fail";
    process.message = "Error retrieving data";
  } finally {
    res.render("asset-categories/home", { data, process });
  }
};

const newForm = async (req, res) => {
  res.render("asset-categories/form", { type: "new" });
};

const editForm = async (req, res) => {
  const { id } = req.params;
  try {
    const assetCategory = await AssetCategory.findByPk(id);
    if (!assetCategory) {
      const process = { type: "fail", message: "Asset category not found" };
      return res.redirect(`/asset-categories?process=${process.type}&message=${process.message}`);
    }
    res.render("asset-categories/form", { data: assetCategory, type: "edit" });
  } catch (error) {
    const process = { type: "fail", message: "Error occured" };
    return res.redirect(`/asset-categories?process=${process.type}&message=${process.message}`);
  }
};

const createAssetCategorySchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name should have at least 3 characters",
    "string.max": "Name should not exceed 100 characters",
  }),
});

const create = async (req, res) => {
  const { error, value } = createAssetCategorySchema.validate(req.body);

  if (error) return res.render("asset-categories/form", { type: "new", data: { id, ...req.body }, error });

  try {
    await AssetCategory.create(value);
    const process = { type: "success", message: "Asset category added" };
    return res.redirect(`/asset-categories?process=${process.type}&message=${process.message}`);
  } catch (error) {
    const process = { type: "fail", message: "Error occured" };
    if (error instanceof Sequelize.UniqueConstraintError) {
      process.message = "Duplicate entry, data already exists";
      return res.render("asset-categories/form", { type: "new", data: req.body, process, error: process.message });
    }
    return res.redirect(`/asset-categories?process=${process.type}&message=${process.message}`);
  }
};

const updateAssetCategorySchema = Joi.object({
  name: Joi.string().min(3).max(100).optional().messages({
    "string.min": "Name should have at least 3 characters",
    "string.max": "Name should not exceed 100 characters",
  }),
});

const update = async (req, res) => {
  const { id } = req.params;
  try {
    const assetCategory = await AssetCategory.findByPk(id);
    if (!assetCategory) {
      const process = { type: "fail", message: "Asset category not found" };
      return res.redirect(`/asset-categories?process=${process.type}&message=${process.message}`);
    }

    const { error, value } = updateAssetCategorySchema.validate(req.body);
    if (error) return res.render("asset-categories/form", { type: "edit", data: { id, ...req.body }, error });

    await assetCategory.update(value);
    const process = { type: "success", message: "Asset category updated" };
    return res.redirect(`/asset-categories?process=${process.type}&message=${process.message}`);
  } catch (error) {
    const process = { type: "fail", message: "Error occured" };
    if (error instanceof Sequelize.UniqueConstraintError) {
      process.message = "Duplicate entry, data already exists";
      return res.render("asset-categories/form", { type: "edit", data: { id, ...req.body }, process, error: process.message });
    }
    res.redirect(`/asset-categories?process=${process.type}&message=${process.message}`);
  }
};

module.exports = { home, newForm, editForm, create, update };
