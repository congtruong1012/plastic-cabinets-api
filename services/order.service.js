const { startOfDay, endOfDay } = require("date-fns");
const Order = require("../models/order.model");
const _get = require("lodash/get");
const createHttpError = require("http-errors");

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
  const { code, customer, detail, totalPrice, status } = body;
  const order = new Order({
    code,
    customer,
    detail,
    totalPrice,
    status,
  });
  return await order.save();
};

const getListOrder = async ({
  limit = 10,
  page = 1,
  code,
  from,
  to,
  status,
}) => {
  const filter = {
    ...(code ? { code } : {}),
    ...(status ? { status } : {}),
    ...(from && to
      ? {
          createdAt: {
            $gte: startOfDay(new Date(from)),
            $lte: endOfDay(new Date(to)),
          },
        }
      : {}),
  };
  const data = await Order.find(filter)
    .populate({
      path: "detail.product",
      select: "name price discount images",
    })
    .populate({
      path: "customer",
      select: "fullName",
    })
    .limit(limit)
    .skip(limit * (page - 1))
    .sort({ createdAt: -1 });

  const total = await Order.count(filter);

  return {
    data,
    meta: {
      page: +page,
      total,
    },
  };
};

const getNewestOrder = async () => {
  return await Order.find({}).limit(10).sort({ createdAt: -1 }).populate({
    path: "customer",
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
      cur[eTotal[index + 1]] = _get(item, "[0].total", 0);
      return cur;
    }, {})
  );
};

const confirmOrder = async (code) => {
  const order = await Order.findOne({ code });
  if (!order) throw createHttpError.NotFound("Order not found");
  if (order.status !== 1)
    throw createHttpError.BadRequest("Order is not waiting");
  order.status = 2;
  await order.save();
  return { data: { code, status: 2 } };
};

const cancelOrder = async (code) => {
  const order = await Order.findOne({ code });
  if (!order) throw createHttpError.NotFound("Order not found");
  if (order.status !== 1)
    throw createHttpError.BadRequest("Order is not waiting");
  order.status = 4;
  await order.save();
  return { data: { code, status: 4 } };
};

const deliverOrder = async (code) => {
  const order = await Order.findOne({ code });
  if (!order) throw createHttpError.NotFound("Order not found");
  if (order.status !== 2)
    throw createHttpError.BadRequest("Order is not confirmed");
  order.status = 3;
  await order.save();
  return { data: { code, status: 2 } };
};

module.exports = {
  createOrder,
  getNewestOrder,
  getDashboardOrder,
  getTurnoverOrder,
  getListOrder,
  confirmOrder,
  cancelOrder,
  deliverOrder,
};
