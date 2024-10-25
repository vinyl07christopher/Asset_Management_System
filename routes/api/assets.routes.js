const express = require("express");
const router = express.Router();
const { getAll, get, create, update, remove, issueAsset, returnAsset, scrapAsset, assetHistory } = require("../../controllers/assets.controller.js");
const stockRouter = require("./stock.routes.js");

router.use("/stock", stockRouter);
router.post("/issue/:id", issueAsset);
router.post("/return/:id", returnAsset);
router.post("/scrap/:id", scrapAsset);
router.get("/history/:id", assetHistory);

router.get("/", getAll);
router.get("/:id", get);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
