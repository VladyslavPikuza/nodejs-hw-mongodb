const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Session = require("../models/Session");
const { registerSchema, loginSchema } = require("../models/authValidation");
const { requestResetToken, resetPasswordService } = require("../services/auth");

const registerUser = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    throw createError(400, error.details[0].message);
  }

  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });

  res.status(201).json({
    status: 201,
    message: "User registered successfully",
    data: { id: newUser._id, name: newUser.name, email: newUser.email },
  });
};

const loginUser = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    throw createError(400, error.details[0].message);
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
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

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: "Login successful",
    data: { accessToken },
  });
};

const refreshSession = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw createError(401, "No refresh token provided");
  }


  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch (error) {
    throw createError(403, "Refresh token expired or invalid");
  }

  const session = await Session.findOne({ refreshToken });

  if (!session) {
    throw createError(401, "Invalid refresh token");
  }


  if (session.refreshTokenValidUntil < new Date()) {
    await Session.deleteOne({ _id: session._id });
    throw createError(403, "Refresh token expired. Please log in again.");
  }

  const userId = session.userId;


  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
  const newRefreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });


  session.accessToken = accessToken;
  session.refreshToken = newRefreshToken;
  session.accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  session.refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await session.save();


  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: "Session refreshed successfully",
    data: { accessToken },
  });
};

const logoutUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw createError(401, "Unauthorized: No refresh token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch (error) {
    throw createError(401, "Unauthorized: Invalid refresh token");
  }

  await Session.deleteMany({ userId: decoded.userId });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.status(204).json({
    status: 204,
    message: "Logout successful",
  });
};

const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    status: 200,
    message: "Reset password email has been successfully sent.",
    data: {},
  });
};

const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await resetPasswordService(token, password);

    res.json({
      status: 200,
      message: "Password has been successfully reset.",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, refreshSession, logoutUser, requestResetEmailController, resetPasswordController };


