const { isValid } = require("date-fns");
const Joi = require("joi");

const orderSchema = (data) => {
  const order = Joi.object({
    customer: Joi.string().required(),
    detail: Joi.array().items({
      product: Joi.string().required(),
      quantity: Joi.number().required(),
    }),
    totalPrice: Joi.number().required(),
    status: Joi.number().required(),
  });
  return order.validate(data);
};

const filterOrderSchema = (data) => {
  const filter = Joi.object({
    code: Joi.string().allow(""),
    from: Joi.string()
      .allow("")
      .custom((value, helper) =>
        !isValid(new Date(value)) || value === null
          ? helper.message("Invalid from date")
          : true
      ),
    to: Joi.string()
      .allow("")
      .custom((value, helper) =>
        !isValid(new Date(value)) || value === null
          ? helper.message("Invalid to date")
          : true
      ),
    status: Joi.number().custom((value, helper) => {
      return ![1, 2, 3, 4].includes(value)
        ? helper.message("Invalid status")
        : true;
    }),
  }).custom((obj, helper) => {
    if (obj.from) {
      return !obj.to ? helper.message("To date is required") : true;
    }
    if (obj.to) {
      return !obj.from ? helper.message("From date is required") : true;
    }
    return true;
  });

  return filter.validate(data);
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
  }).custom((obj, helper) => {
    if (obj.from) {
      return !obj.to ? helper.message("To date is required") : true;
    }
    if (obj.to) {
      return !obj.from ? helper.message("From date is required") : true;
    }
    return true;
  });
  return dashboard.validate(data);
};

module.exports = { orderSchema, filterOrderSchema, dashboardSchema };
