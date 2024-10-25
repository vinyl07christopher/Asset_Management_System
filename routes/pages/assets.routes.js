const express = require("express");
const router = express.Router();
const { home, newForm, editForm, create, update, assetHistoryHome, assetHistory } = require("../../controllers/pages/assets.controller");
const { home: stockHome } = require("../../controllers/pages/stocks.controller");
const issueRouter = require("./issues.routes");
const scrapRouter = require("./scrap.routes");

router.get("/", home);
router.get("/new", newForm);
router.post("/new", create);
router.get("/edit/:id", editForm);
router.post("/edit/:id", update);

router.get("/stock", stockHome);
router.use("/assign", issueRouter);
router.use("/scrap", scrapRouter);
router.get("/history", assetHistoryHome);
router.get("/history/:id", assetHistory);

module.exports = router;
