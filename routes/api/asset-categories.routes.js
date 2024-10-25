const express = require("express");
const { get, create, getAll, remove, update } = require("../../controllers/asset-categories.controller");
const router = express.Router();

router.get("/", getAll);
router.post("/", create);
router.get("/:id", get);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
