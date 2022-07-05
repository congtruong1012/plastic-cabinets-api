const createHttpError = require("http-errors");
const _uniqueId = require("lodash/uniqueId");
const _format = require("date-fns/format");
const {
  orderSchema,
  dashboardSchema,
} = require("../middleware/validate/order.validate");
const orderService = require("../services/order.service");
const { isValid } = require("date-fns");

const OrderController = {
  createOrder: async (req, res, next) => {
    try {
      const { customer, detail, totalPrice, status } = req.body;
      const { error } = orderSchema({
        customer,
        detail,
        totalPrice,
        status,
      });
      if (error) throw createHttpError.BadRequest(error.details[0].message);

      const order = await orderService.createOrder({
        code: _uniqueId(`O-${_format(new Date(), "ddMMyyHHmmss")}-`),
        customer,
        detail,
        totalPrice,
        status,
      });
      console.log("createOrder: ~ order", order);
      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  },

  getNewestOrder: async (req, res, next) => {
    try {
      const orders = await orderService.getNewestOrder();
      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  },

  getListOrder: async (req, res, next) => {
    try {
      const { limit = 10, page = 1, code, date, status } = req.query;
      if (date && !isValid(new Date(date)))
        throw createHttpError.BadRequest("Invalid date");
      if (status && ![1, 2, 3, 4].includes(status))
        throw createHttpError.BadRequest("Invalid status value");
      const orders = await orderService.getListOrder({
        limit,
        page,
        code,
        date,
        status,
      });
      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  },
  getDashboardOrder: async (req, res, next) => {
    try {
      const { from, to } = req.query;
      const { error } = dashboardSchema({ from, to });
      if (error) {
        throw createHttpError.BadRequest(error.details[0].message);
      }
      const dashboard = await orderService.getDashboardOrder({ from, to });
      return res.status(200).json(dashboard);
    } catch (error) {
      next(error);
    }
  },

  getTurnoverOrder: async (req, res, next) => {
    try {
      const { from, to } = req.query;
      const { error } = dashboardSchema({ from, to });
      if (error) {
        throw createHttpError.BadRequest(error.details[0].message);
      }
      const turnover = await orderService.getTurnoverOrder({ from, to });
      return res.status(200).json(turnover);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = OrderController;
