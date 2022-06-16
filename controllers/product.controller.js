const createHttpError = require("http-errors");
const ObjectId = require("mongoose").Types.ObjectId;
const { productSchema } = require("../middleware/validate/product.validate");
const productService = require("../services/product.service");

const ProductController = {
  creUpd: async (req, res, next) => {
    try {
      const { id, name, description, price, discount, images, category } =
        req.body;
      const { error } = productSchema({
        name,
        description,
        price,
        discount,
        images,
        category,
      });
      if (error) throw createHttpError.BadRequest(error.details[0].message);
      if (id) {
        const product = await productService.updateProduct(id, {
          name,
          description,
          price,
          discount,
          images,
          category,
        });
        return res.status(200).json(product);
      } else {
        const product = await productService.createProduct({
          id,
          name,
          description,
          price,
          discount,
          images,
          category,
        });
        return res.status(200).json(product);
      }
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const { sort, category } = req.query;
      if (category && !ObjectId.isValid(category))
        throw createHttpError.BadRequest("Invalid category id");
      if (sort && !["asc", "desc"].includes(sort))
        throw createHttpError.BadRequest("Sort must be asc or desc");
      const categories = await productService.getAllProducts(req.query);
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
      const Product = await productService.getProduct(id);
      return res.status(200).json(Product);
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
      await productService.deleteProduct(id);
      return res.status(200).json({ id });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = ProductController;
