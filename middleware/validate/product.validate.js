const Joi = require("joi");

const productSchema = (data) => {
  const product = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    discount: Joi.number().required(),
    images: Joi.array().required(),
    typeProd: Joi.number().required(),
    category: Joi.string().required(),
  });
  return product.validate(data);
};

module.exports = { productSchema };
