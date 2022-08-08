const jwt = require("jsonwebtoken");
const { EXPIRE_ACCESS_TOKEN, EXPIRE_REFRESH_TOKEN } = require("../constants");
const tokenModel = require("../models/token.model");

const generateToken = (payload) => {
  // 
  const token = jwt.sign(payload, process.env.SCRET_TOKEN, {
    expiresIn: EXPIRE_ACCESS_TOKEN,
  });
  return token;
};

const generateRefreshToken = async (payload) => {
  const token = jwt.sign(payload, process.env.SCRET_REFRESH_TOKEN, {
    expiresIn: EXPIRE_REFRESH_TOKEN,
  });
  await tokenModel.create({ token });
  return token;
};

module.exports = { generateToken, generateRefreshToken };
