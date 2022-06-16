const Product = require("../models/product.model");
const ObjectId = require("mongoose").Types.ObjectId;

const createProduct = async (body) => {
  const { name, description, price, discount, images, category } = body;
  const product = new Product({
    name,
    description,
    price,
    discount,
    images,
    category,
  });
  return await product.save();
};

const getAllProducts = async (params) => {
  const { limit = 10, page = 1, name, category, sort } = params;
  return await Product.find({ name: new RegExp(name, "i"), category })
    .sort({ price: sort })
    .skip(limit * (page - 1))
    .limit(limit);
};

const getProduct = async (id) => {
  return await Product.findById({ _id: new ObjectId(id) }).populate("category");
};

const updateProduct = async (id, body) => {
  return await Product.findByIdAndUpdate({ _id: new ObjectId(id) }, body, {
    returnOriginal: false,
  });
};

const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete({ _id: new ObjectId(id) });
};

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
