const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const ObjectId = require("mongoose").Types.ObjectId;

const createUser = async (body) => {
  const { password, ...other } = body;
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);
  const user = new userModel({
    ...other,
    password: passwordHash,
  });
  return await user.save();
};

const getUser = async ({ limit = 10, page = 1, username, role }) => {
  const filter = {
    username: new RegExp(username, "g"),
    ...(role ? { role } : {}),
  };
  const users = await userModel
    .find(filter)
    .select("-password")
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await userModel.count(filter);
  return {
    data: users,
    meta: {
      total,
    },
  };
};

const setRoleMember = async (id) => {
  return await userModel.findByIdAndUpdate(
    { _id: new ObjectId(id) },
    {
      role: 0,
    },
    {
      returnOriginal: false,
    }
  );
};

const removeRoleMember = async (id) => {
  return await userModel.findByIdAndUpdate(
    { _id: new ObjectId(id) },
    {
      role: -1,
    },
    {
      returnOriginal: false,
    }
  );
};
module.exports = { createUser, getUser, setRoleMember, removeRoleMember };
