const express = require("express");
const { home, getForm, scrapAsset } = require("../../controllers/pages/scraps.controller");
const router = express.Router();

router.get("/", home);
router.get("/:id", getForm);
router.post("/:id", scrapAsset);

module.exports = router;
