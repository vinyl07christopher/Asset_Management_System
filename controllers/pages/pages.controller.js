const { Op } = require("sequelize");
const AssetCategory = require("../../models/asset-category.model");
const Asset = require("../../models/asset.model");
const Employee = require("../../models/employee.model");
const User = require("../../models/user.model");
const Joi = require("joi");

const loginPage = async (req, res) => {
  if (req.session?.user?.isAuthenticated) return res.redirect("/");

  res.render("login", { process: {} });
};

const dashboard = async (req, res) => {
  const data = {};

  try {
    data.employeeCount = await Employee.count();
    data.assetCategoryCount = await AssetCategory.count();
    data.assetTotalCount = await Asset.count({ where: { status: { [Op.ne]: "scrapped" } } });
    data.assetInStockCount = await Asset.count({ where: { status: "in stock" } });
    data.assetIssuedCount = await Asset.count({ where: { status: "issued" } });
    data.assetScrappedCount = await Asset.count({ where: { status: "scrapped" } });
  } catch (error) {
    console.log(error);
  } finally {
    res.render("dashboard", { data });
  }
};

const _404Page = async (req, res) => {
  const isApiRoute = req.originalUrl.startsWith("/api/");

  if (isApiRoute) return res.status(404).json({ message: "route not found" });
  res.render("404");
};

const login = async (req, res) => {
  const { error, value } = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is required.",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long.",
      "any.required": "Password is required.",
    }),
  }).validate(req.body);

  if (error) return res.render("login", { data: req.body, process: { type: "fail", message: "Invalid Input" }, error });

  const user = await User.findOne({ where: { email: value.email } });

  if (!user || !user.verifyPassword(value.password))
    return res.render("login", { data: req.body, process: { type: "fail", message: "Invalid Credentials" }, error: "Invalid Credentials" });
  req.session.user = {
    id: user.id,
    isAuthenticated: true,
  };

  res.redirect("/");
};

const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.redirect("/?process=fail&message=Error while logging out");
    }
    res.redirect("/login");
  });
};

const registerPage = async (req, res) => {
  if (req.session?.user?.isAuthenticated) return res.redirect("/");

  res.render("register", { process: {} });
};
const register = async (req, res) => {
  const { error, value } = Joi.object({
    username: Joi.string().min(3).required().messages({
      "string.min": "Username must be at least 3 characters long.",
      "any.required": "Username is required.",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is required.",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long.",
      "any.required": "Password is required.",
    }),
  }).validate(req.body);

  if (error) return res.render("register", { data: req.body, process: { type: "fail", message: "Invalid Input" }, error });

  const existingUser = await User.findOne({ where: { email: value.email } });
  if (existingUser) return res.render("register", { data: req.body, process: { type: "fail", message: "User already exists" } });

  try {
    const user = await User.create(value);
    req.session.user = {
      id: user.id,
      isAuthenticated: true,
    };
    res.redirect("/");
  } catch (error) {
    console.error("Registration error:", error);
    return res.render("register", { data: req.body, process: { type: "fail", message: "Error occured" } });
  }
};

module.exports = {
  dashboard,
  loginPage,
  _404Page,
  logout,
  login,

  registerPage,
  register,
};
