const Joi = require("joi");

const login = (data) => {
  const userSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  return userSchema.validate(data);
};

module.exports = { login };
