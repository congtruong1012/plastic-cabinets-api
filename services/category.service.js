const Category = require("../models/category.model");
const ObjectId = require("mongoose").Types.ObjectId;

const createCategory = async (body) => {
  const { name } = body;
  const category = new Category({ name });
  return await category.save();
};

const getAllCaetories = async (params) => {
  const { limit = 10, skip = 0, name } = params;
  return await Category.find({ name: new RegExp(name, "i") })
    .limit(limit)
    .skip(skip);
};

const getCategory = async (id) => {
  return await Category.findById({ _id: new ObjectId(id) });
};

const updateCategory = async (id, body) => {
  return await Category.findByIdAndUpdate({ _id: new ObjectId(id) }, body, {
    returnOriginal: false,
  });
};

const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete({ _id: new ObjectId(id) });
};

module.exports = {
  createCategory,
  getAllCaetories,
  getCategory,
  updateCategory,
  deleteCategory,
};
