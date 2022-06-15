const Joi = require("joi");

const categorySchema = (data) => {
  const category = Joi.object({
    name: Joi.string().required(),
  });
  return category.validate(data);
};

module.exports = { categorySchema };
