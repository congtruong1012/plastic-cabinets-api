const { startOfDay, endOfDay } = require("date-fns");
const Order = require("../models/order.model");
const _get = require("lodash/get");

const eStatus = {
  1: "waiting",
  2: "confirmed",
  3: "delivered",
  4: "canceled",
};

const eTotal = {
  1: "success",
  2: "failed",
};

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
  return await Order.find({}).limit(10).sort({ createdAt: -1 }).populate({
    path: "customerId",
    select: "fullName",
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
  ).then((res) =>
    res.reduce((cur, item, index) => {
      cur[eStatus[index + 1]] = item;
      return cur;
    }, {})
  );
};

const getTurnoverOrder = ({ from, to }) => {
  return Promise.all(
    [3, 4].map(async (item) => {
      return await Order.aggregate([
        {
          $match: {
            $or: [{ status: item }],
            createdAt: {
              $gte: startOfDay(new Date(from)),
              $lte: endOfDay(new Date(to)),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPrice" },
          },
        },
      ]);
    })
  ).then((res) =>
    res.reduce((cur, item, index) => {
      cur[eTotal[index + 1]] = _get(item, '[0].total', 0);
      return cur;
    }, {})
  );
};

module.exports = {
  createOrder,
  getNewestOrder,
  getDashboardOrder,
  getTurnoverOrder,
};
