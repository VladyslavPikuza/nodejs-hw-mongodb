const express = require("express");
const { registerUser } = require("../controllers/auth");
const { loginUser } = require("../controllers/auth");
const { refreshSession } = require("../controllers/auth");
const { logoutUser } = require('../controllers/auth');

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshSession);
router.post('/logout', logoutUser);

module.exports = router;
