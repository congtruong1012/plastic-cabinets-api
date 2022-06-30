const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Order = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    detail: {
      type: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: "product",
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      // 1: Chờ xác nhận 2: Xác nhận 3: Đã giao 4: Đã hủy
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

Order.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.customer = ret.customerId;
    delete ret.customerId;
    delete ret._id;
  },
});

module.exports = mongoose.model("order", Order);
