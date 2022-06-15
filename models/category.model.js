const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Category = new Schema(
  {
   name: {
      type: String,
      required: true,
   }
  },
  {
    timestamps: true,
  }
);

Category.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

module.exports = mongoose.model("category", Category);
