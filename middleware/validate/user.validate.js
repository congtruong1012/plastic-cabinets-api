const Joi = require("joi");

const createUser = (data) => {
  const userSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    fullName: Joi.string().required(),
    avatar: Joi.string(),
    role: Joi.number(),
  });
  return userSchema.validate(data);
};

module.exports = { createUser };
