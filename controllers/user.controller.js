const createError = require("http-errors");
const { createUser } = require("../middleware/validate/user.validate");
const userService = require("../services/user.service");

const UserController = {
  create: async (req, res, next) => {
    try {
      const { error } = createUser(req.body);
      if (error) {
        throw createError.BadRequest(error.details[0].message);
      }
      const user = await userService.createUser(req.body);

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      const user = await userService.getUser(req.query);

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  setRoleMember: async (req, res, next) => {
    try {
      if (!req.body.id) {
        throw createError.BadRequest("Id is required");
        return;
      }
      const user = await userService.setRoleMember(req.body.id);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  removeRoleMember: async (req, res, next) => {
    try {
      if (!req.body.id) {
        throw createError.BadRequest("Id is required");
        return;
      }
      const user = await userService.removeRoleMember(req.body.id);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = UserController;
