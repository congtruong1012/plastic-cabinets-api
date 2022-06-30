const createHttpError = require("http-errors");
const _uniqueId = require("lodash/uniqueId");
const _format = require("date-fns/format");
const {
  orderSchema,
  dashboardSchema,
} = require("../middleware/validate/order.validate");
const orderService = require("../services/order.service");

const OrderController = {
  createOrder: async (req, res, next) => {
    try {
      const { customerId, detail, totalPrice, status } = req.body;
      const { error } = orderSchema({
        customerId,
        detail,
        totalPrice,
        status,
      });
      if (error) throw createHttpError.BadRequest(error.details[0].message);

      const order = await orderService.createOrder({
        code: _uniqueId(`O-${_format(new Date(), "ddMMyyHHmmss")}-`),
        customerId,
        detail,
        totalPrice,
        status,
      });
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
  }
};

module.exports = OrderController;
