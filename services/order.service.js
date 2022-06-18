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
  return await Order.find({}).sort({ createdAt: -1 });
};

const getDashboardOrder = (params) => {
  return Promise.all(
    [1, 2, 3, 4].map(async (item) => {
      return await Order.count({ status: item });
    })
  );
};

module.exports = {
  createOrder,
  getNewestOrder,
  getDashboardOrder,
};
