const express = require("express");
const ctrlWrapper = require("../utils/ctrlWrapper");
const validateBody = require("../middlewares/validateBody");
const { registerSchema, loginSchema } = require("../models/authValidation");
const { registerUser, loginUser, refreshSession, logoutUser } = require("../controllers/auth");

const router = express.Router();

router.post("/register", validateBody(registerSchema), ctrlWrapper(registerUser));
router.post("/login", validateBody(loginSchema), ctrlWrapper(loginUser));
router.post("/refresh", ctrlWrapper(refreshSession));
router.post("/logout", ctrlWrapper(logoutUser));

module.exports = router;
