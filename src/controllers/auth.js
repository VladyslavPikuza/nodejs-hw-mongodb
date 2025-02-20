const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Session = require("../models/Session");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw createError(400, "All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(409, "Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      status: "success",
      message: "Successfully registered a user!",
      data: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError(400, "Email and password are required");
    }

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
    //   secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      message: "Successfully logged in a user!",
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};


const refreshSession = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw createError(401, "No refresh token provided");
    }

    const session = await Session.findOne({ refreshToken });
    if (!session) {
      throw createError(401, "Invalid refresh token");
    }

    const userId = session.userId;


    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const newRefreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });


    session.accessToken = accessToken;
    session.refreshToken = newRefreshToken;
    session.accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
    session.refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await session.save();


    res.status(200).json({
      status: "success",
      message: "Successfully refreshed a session!",
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw createError(401, "No refresh token provided");
    }


    await Session.deleteMany({ refreshToken });

    
    res.clearCookie("refreshToken");

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, refreshSession, logoutUser };
