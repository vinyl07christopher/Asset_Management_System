const express = require("express");
const router = express.Router();
const { home, newEmployeePage, editPage, create, update } = require("../../controllers/pages/employees.controller");

router.get("/", home);
router.get("/new", newEmployeePage);
router.post("/new", create);
router.get("/edit/:id", editPage);
router.post("/edit/:id", update);

module.exports = router;
