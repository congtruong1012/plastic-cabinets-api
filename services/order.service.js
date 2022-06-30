const { startOfDay, endOfDay } = require("date-fns");
const Order = require("../models/order.model");
const ObjectId = require("mongoose").Types.ObjectId;

const createOrder = async (body) => {
  const { code, customerId, detail, totalPrice, status } = body;
  const order = new Order({
    code,
    customerId,
    detail,
    totalPrice,
    status,
  });
  return await order.save();
};

const getNewestOrder = async () => {
  return await Order.find({}).limit(10)
    .sort({ createdAt: -1 })
    .populate({
      path: "customerId",
      select: "fullName",
    })
    .populate({
      path: "detail.product",
      select: "name price discount",
    });
};

const getDashboardOrder = ({ from, to }) => {
  return Promise.all(
    [1, 2, 3, 4].map(async (item) => {
      return await Order.count({
        status: item,
        createdAt: {
          $gte: startOfDay(new Date(from)),
          $lte: endOfDay(new Date(to)),
        },
      });
    })
  );
};

module.exports = {
  createOrder,
  getNewestOrder,
  getDashboardOrder,
};
