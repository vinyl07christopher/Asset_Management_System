const express = require("express");
const router = express.Router();
const { stock, stockByBranch, stockByCategory, summary } = require("../../controllers/stocks.controller");

router.get("/", stock);
router.get("/summary", summary);
router.get("/branch/:branch", stockByBranch);
router.get("/category/:category", stockByCategory);

module.exports = router;
