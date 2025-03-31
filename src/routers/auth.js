const express = require("express");
const ctrlWrapper = require("../utils/ctrlWrapper");
const validateBody = require("../middlewares/validateBody");
const { registerSchema, loginSchema, requestResetEmailSchema } = require("../models/authValidation");
const { registerUser, loginUser, refreshSession, logoutUser, requestResetEmailController } = require("../controllers/auth");

const router = express.Router();

router.post("/register", validateBody(registerSchema), ctrlWrapper(registerUser));
router.post("/login", validateBody(loginSchema), ctrlWrapper(loginUser));
router.post("/refresh", ctrlWrapper(refreshSession));
router.post("/logout", ctrlWrapper(logoutUser));
router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

module.exports = router;
