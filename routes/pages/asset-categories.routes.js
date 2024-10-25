const express = require("express");
const router = express.Router();
const { home, newForm, editForm, create, update } = require("../../controllers/pages/asset-categories.controller");

router.get("/", home);
router.get("/new", newForm);
router.post("/new", create);
router.get("/edit/:id", editForm);
router.post("/edit/:id", update);

module.exports = router;
