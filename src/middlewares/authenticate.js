const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const Session = require("../models/Session");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError(401, "Unauthorized: No token provided");
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return next(createError(401, "Unauthorized: Token expired"));
      }
      return next(createError(401, "Unauthorized: Invalid token"));
    }

    const session = await Session.findOne({ userId: decoded.userId });
    if (!session) {
      throw createError(401, "Unauthorized: Session not found");
    }

    if (session.accessToken !== token) {
      throw createError(401, "Unauthorized: Invalid session");
    }

    req.user = { _id: decoded.userId };
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    next(error);
  }
};

module.exports = authenticate;
