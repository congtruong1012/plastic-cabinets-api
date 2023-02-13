const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: Number, // 1: admin 0: member -1: user,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

User.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

module.exports = mongoose.model("user", User);
