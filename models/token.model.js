const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Token = new Schema(
  {
    token: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

Token.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

module.exports = mongoose.model("token", Token);
