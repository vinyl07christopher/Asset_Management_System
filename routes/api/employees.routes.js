const express = require("express");
const router = express.Router();
const { getAll, get, create, update, remove } = require("../../controllers/employees.controller");

router.get("/", getAll);
router.get("/:id", get);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
