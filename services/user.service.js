const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");

const createUser = async (body) => {
  const {password, ...other} = body;
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);
  const user = new userModel({
    ...other,
    password: passwordHash,
  });
  return await user.save();
};

const getUser = async () => {
  return await userModel.find();
};

module.exports = { createUser, getUser };
