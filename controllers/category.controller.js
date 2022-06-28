const createHttpError = require("http-errors");
const { categorySchema } = require("../middleware/validate/category.validate");
const categoryService = require("../services/category.service");

const CategoryController = {
  creUpd: async (req, res, next) => {
    try {
      const { id, name } = req.body;
      const { error } = categorySchema({ name });
      if (error) throw createHttpError.BadRequest(error.details[0].message);
      if (id) {
        const category = await categoryService.updateCategory(id, { name });
        return res.status(200).json(category);
      } else {
        const category = await categoryService.createCategory({ id, name });
        return res.status(200).json(category);
      }
    } catch (error) {
      next(error);
    }
  },

  getList: async (req, res, next) => {
    try {
      const categories = await categoryService.getListCatetories(req.query);
      return res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const categories = await categoryService.getAllCatetories();
      return res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      const id = req.query.id;
      if (!id) {
        throw createHttpError.BadRequest("id is required");
      }
      const category = await categoryService.getCategory(id);
      return res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const id = req.body.id;
      if (!id) {
        throw createHttpError.BadRequest("id is required");
      }
      await categoryService.deleteCategory(id);
      return res.status(200).json({ id });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = CategoryController;
