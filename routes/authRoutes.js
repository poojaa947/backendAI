
const express = require("express");
const { register, login, verifyUser } = require("../controllers/authController");

const router = express.Router();
router.get("/verify",verifyUser)
router.post("/register",register);
router.post("/login",login);

module.exports = router;