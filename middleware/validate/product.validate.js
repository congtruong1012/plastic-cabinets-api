const Joi = require("joi");

const productSchema = (data) => {
  const category = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    discount: Joi.number().required(),
    images: Joi.array().required(),
    category: Joi.string().required(),
  });
  return category.validate(data);
};

module.exports = { productSchema };
