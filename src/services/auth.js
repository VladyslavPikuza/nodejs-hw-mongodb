const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const createError = require("http-errors");
const User = require("../models/user");
const Session = require("../models/Session");
const sendEmail = require("../utils/sendMail");
const { getEnvVar } = require("../utils/getEnvVar");


const registerUserService = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return User.create({ name, email, password: hashedPassword });
};

const loginUserService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createError(401, "Invalid email or password");
  }

  await Session.deleteMany({ userId: user._id });

  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};

const requestResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, "User not found");
  }

  const resetToken = jwt.sign(
    { sub: user._id, email },
    getEnvVar("JWT_SECRET"),
    { expiresIn: "5m" }
  );

  const resetLink = `${getEnvVar("APP_DOMAIN")}/reset-password?token=${resetToken}`;

  await sendEmail({
    from: getEnvVar("SMTP_FROM"),
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password!</p>`,
  });
};

module.exports = { registerUserService, loginUserService, requestResetToken };
