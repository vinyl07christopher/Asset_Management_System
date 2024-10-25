const express = require("express");
const { create, login, logout } = require("../../controllers/auth.controller");
const router = express.Router();

// router.post("/register", create);
router.get("/login", login);
router.post("/logout", logout);

module.exports = router;
