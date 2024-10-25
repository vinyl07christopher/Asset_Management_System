const express = require("express");
const { dashboard, _404Page, loginPage, logout, login, registerPage, register } = require("../controllers/pages/pages.controller");
const apiRouter = require("./api/api.routes");
const employeePageRouter = require("./pages/employees.routes");
const assetCategoryPageRouter = require("./pages/asset-categories.routes");
const assetPageRouter = require("./pages/assets.routes");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

// router.use("/api", authMiddleware, apiRouter);
router.get("/login", loginPage);
router.get("/register", registerPage);
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/", authMiddleware, dashboard);
router.use("/employees", authMiddleware, employeePageRouter);
router.use("/assets", authMiddleware, assetPageRouter);
router.use("/asset-categories", authMiddleware, assetCategoryPageRouter);
router.get("/*", _404Page);

module.exports = router;
