const Joi = require("joi");

/**
     code: {
    customer: {
    detail: {
    totalPrice: {
    status: {

 * @param {*} data 
 * @returns 
 */

const orderSchema = (data) => {
  const order = Joi.object({
    code: Joi.string().required(),
    customerId: Joi.string().required(),
    detail: Joi.array().items({
      product: Joi.string().required(),
      quantity: Joi.number().required(),
    }),
    totalPrice: Joi.number().required(),
    status: Joi.number().required(),
  });
  return order.validate(data);
};

module.exports = { orderSchema };
