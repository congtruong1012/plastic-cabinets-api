const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const ObjectId = require("mongoose").Types.ObjectId;

const userModel = require("../../models/user.model");

const verifyToken = (req, res, next) => {
  try {
    const token = req.signedCookies.accessToken;
    if (!token) {
      next(createError.Unauthorized());
      return;
    }
    jwt.verify(token, process.env.SCRET_TOKEN, (err, decoded) => {
      if (err) {
        next(createError.Unauthorized(err.name));
        return;
      }
      req.user = decoded.id;
      next();
    });
  } catch (error) {
    next(error);
  }
};

const verifyRole = async (req, res, next) => {
  const id = req.user;
  const user = await userModel.findById({ _id: new ObjectId(id) });
  if (!user) {
    next(createError.Unauthorized());
    return;
  }
  if (user.role === 0) {
    next(createError.Forbidden("Bạn không có quyền truy cập"));
    return;
  }
  next();
};

module.exports = { verifyToken, verifyRole };
