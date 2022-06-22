const createHttpError = require("http-errors");
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const tokenModel = require("../models/token.model");
const ObjectId = require("mongoose").Types.ObjectId;

const login = async (body) => {
  try {
    const { email, password } = body;
    const user = await userModel.findOne({ email });
    if (!user) throw createHttpError.NotFound("Tài khoản không tồn tại");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createHttpError.BadRequest("Mật khẩu không đúng");
    return user;
  } catch (err) {
    console.log(err);
  }
};

const getCurrentUser = async (id) => {
  const user = await userModel.findById({ _id: new ObjectId(id) });
  if (!user) throw createHttpError.NotFound("Tài khoản không tồn tại");
  return user;
};

const logout = async (token) => {
  return await tokenModel.deleteOne({ token });
};

module.exports = { login, getCurrentUser, logout };
