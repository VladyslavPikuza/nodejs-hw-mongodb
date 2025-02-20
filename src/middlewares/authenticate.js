const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const Session = require("../models/Session");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError(401, "Unauthorized");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const session = await Session.findOne({ userId: decoded.userId, accessToken: token });
    if (!session) {
      throw createError(401, "Unauthorized");
    }


    req.user = { id: decoded.userId };
    next();
  } catch (error) {
      console.error('Authentication error:', error);
    next(error);
  }
};

module.exports = authenticate;
