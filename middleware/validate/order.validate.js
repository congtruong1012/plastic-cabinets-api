const { isValid } = require("date-fns");
const Joi = require("joi");

const orderSchema = (data) => {
  const order = Joi.object({
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

const dashboardSchema = (data) => {
  const dashboard = Joi.object({
    from: Joi.string()
      .required()
      .custom((value, helper) => {
        return !isValid(new Date(value)) || value === null
          ? helper.message("Invalid from date")
          : true;
      }),
    to: Joi.string()
      .required()
      .custom((value, helper) => {
        return !isValid(new Date(value)) || value === null
          ? helper.message("Invalid to date")
          : true;
      }),
  });
  return dashboard.validate(data);
};

module.exports = { orderSchema, dashboardSchema };
