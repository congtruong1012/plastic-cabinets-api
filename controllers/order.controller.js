const createHttpError = require("http-errors");
const {
  orderSchema,
  dashboardSchema,
} = require("../middleware/validate/order.validate");
const orderService = require("../services/order.service");

const OrderController = {
  createOrder: async (req, res, next) => {
    try {
      const { code, customerId, detail, totalPrice, status } = req.body;
      const { error } = orderSchema({
        code,
        customerId,
        detail,
        totalPrice,
        status,
      });
      if (error) throw createHttpError.BadRequest(error.details[0].message);

      const order = await orderService.createOrder({
        code,
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
};

module.exports = OrderController;
