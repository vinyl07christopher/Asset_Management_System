const { Op } = require("sequelize");
const sequelize = require("../../config/sequelize");
const AssetCategory = require("../../models/asset-category.model");
const AssetHistory = require("../../models/asset-history.model");
const Asset = require("../../models/asset.model");
const Employee = require("../../models/employee.model");
const Joi = require("joi");

const home = async (req, res) => {
  const process = {
    ...(req.query.process && { type: req.query.process }),
    ...(req.query.message && { message: req.query.message }),
  };
  const data = {};
  try {
    const assets = await Asset.findAll({
      where: { status: { [Op.ne]: "scrapped" } },
      include: [
        { model: AssetCategory, as: "category", attributes: ["id", "name"] },
        { model: Employee, as: "employee", attributes: ["id", "name"] },
      ],
    });

    data.assetsInStock = assets.filter((asset) => asset.status === "in stock");
    data.assetsIssued = assets.filter((asset) => asset.status === "issued");
  } catch (error) {
    process.type = "fail";
    process.message = "Error retrieving data";
  } finally {
    res.render("assets/issue/home", { data, process });
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
      return res.redirect(`/assets/assign?process=${process.type}&message=${process.message}`);
    }

    const employees = await Employee.findAll({ attributes: ["id", "name"] });

    return res.render("assets/issue/form", { data: asset, employees });
  } catch (error) {
    const process = { type: "fail", message: "Error occured" };
    return res.redirect(`/assets/assign?process=${process.type}&message=${process.message}`);
  }
};

const assignAssetToEmployee = async (req, res) => {
  const { id } = req.params;
  const { employee: employeeId } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const asset = await Asset.findByPk(id, { where: { status: "in stock" } });
    if (!asset) {
      const process = { type: "fail", message: "Asset not found / in use" };
      return res.redirect(`/assets/assign?process=${process.type}&message=${process.message}`);
    }

    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      const process = { type: "fail", message: "Invalid data" };
      return res.redirect(`/assets/assign?process=${process.type}&message=${process.message}`);
    }

    asset.employeeId = employeeId;
    asset.status = "issued";
    await asset.save({ transaction });

    await AssetHistory.create(
      {
        assetId: asset.id,
        action: "issue",
        employeeId,
      },
      { transaction }
    );

    transaction.commit();
    const process = { type: "success", message: "Asset issued to employee" };
    return res.redirect(`/assets/assign?process=${process.type}&message=${process.message}`);
  } catch (error) {
    transaction.rollback();
    const process = { type: "fail", message: "Error occured" };
    return res.redirect(`/assets/assign?process=${process.type}&message=${process.message}`);
  }
};

const getReturnForm = async (req, res) => {
  const { id } = req.params;

  try {
    const asset = await Asset.findByPk(id, {
      where: { status: "issued" },
      include: [
        { model: AssetCategory, as: "category", attributes: ["id", "name"] },
        { model: Employee, as: "employee", attributes: ["id", "name"] },
      ],
    });
    if (!asset) {
      const process = { type: "fail", message: "Asset not found / in use" };
      return res.redirect(`/assets/assign?process=${process.type}&message=${process.message}`);
    }

    return res.render("assets/return/form", { data: asset });
  } catch (error) {
    const process = { type: "fail", message: "Error occured" };
    return res.redirect(`/assets/assign?process=${process.type}&message=${process.message}`);
  }
};

const returnToStock = async (req, res) => {
  const { id } = req.params;
  const { error, value } = Joi.object({
    reason: Joi.string().min(3).max(100).required().messages({
      "string.base": "Reason should be a type of text",
      "string.empty": "Reason cannot be empty",
      "string.min": "Reason should have at least 3 characters",
      "string.max": "Reason should have at most 100 characters",
      "any.required": "Reason is required",
    }),
  }).validate(req.body);

  const transaction = await sequelize.transaction();
  try {
    const asset = await Asset.findByPk(id, {
      where: { status: "issued" },
      include: [
        { model: AssetCategory, as: "category", attributes: ["id", "name"] },
        { model: Employee, as: "employee", attributes: ["id", "name"] },
      ],
    });

    if (!asset) {
      const process = { type: "fail", message: "Asset not found / not in use" };
      return res.redirect(`/assets/assign?process=${process.type}&message=${process.message}`);
    }

    if (error) {
      const process = { type: "fail", message: "Invalid / incomplete data" };
      return res.render("assets/return/form", { data: { ...req.body, ...JSON.parse(JSON.stringify(asset)) }, error, process });
    }

    await AssetHistory.create(
      {
        assetId: asset.id,
        action: "return",
        employeeId: asset.employeeId,
        reason: value.reason,
      },
      { transaction }
    );

    asset.status = "in stock";
    asset.employeeId = null;
    await asset.save({ transaction });

    transaction.commit();
    const process = { type: "success", message: "Asset returned to stock" };
    return res.redirect(`/assets/assign?process=${process.type}&message=${process.message}`);
  } catch (error) {
    transaction.rollback();
    const process = { type: "fail", message: "Error occured" };
    return res.redirect(`/assets/assign?process=${process.type}&message=${process.message}`);
  }
};

module.exports = { home, getForm, assignAssetToEmployee, getReturnForm, returnToStock };
