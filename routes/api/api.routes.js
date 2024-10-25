const express = require("express");
const authRouter = require("./auth.routes");
const router = express.Router();

const employeesRouter = require("./employees.routes");
const assetsRouter = require("./assets.routes");
const assetCategoriesRouter = require("./asset-categories.routes");
const { _404Page } = require("../../controllers/pages/pages.controller");

router.use("/auth", authRouter);
router.use("/employees", employeesRouter);
router.use("/assets", assetsRouter);
router.use("/asset-categories", assetCategoriesRouter);

// Additional Route:
// GET /reports/scrapped - View a report of all scrapped assets.

router.get("/*", _404Page);

module.exports = router;
