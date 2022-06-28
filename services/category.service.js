const Category = require("../models/category.model");
const ObjectId = require("mongoose").Types.ObjectId;

const createCategory = async (body) => {
  const { name } = body;
  const category = new Category({ name });
  return await category.save();
};

const getAllCatetories = async () => {
  return await Category.find();
};

const getListCatetories = async (params) => {
  const { limit = 10, page = 1, name } = params;
  const data = await Category.find({ name: new RegExp(name, "i") })
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
  const total = await Category.count({ name: new RegExp(name, "i") });
  return { data, meta: { page, total } };
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
  getListCatetories,
  getAllCatetories,
  getCategory,
  updateCategory,
  deleteCategory,
};
