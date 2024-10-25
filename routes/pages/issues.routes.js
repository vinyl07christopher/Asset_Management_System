const express = require("express");
const { home, getForm, assignAssetToEmployee, getReturnForm, returnToStock } = require("../../controllers/pages/issues.controller");
const router = express.Router();

router.get("/", home);
router.get("/issue/:id", getForm);
router.post("/issue/:id", assignAssetToEmployee);
router.get("/return/:id", getReturnForm);
router.post("/return/:id", returnToStock);

module.exports = router;
