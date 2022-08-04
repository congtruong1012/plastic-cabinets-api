const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { EXPIRE_COOKIE } = require("../constants");
const { login } = require("../middleware/validate/auth.validate");
const authService = require("../services/auth.service");
const tokenService = require("../services/token.service");

const AuthController = {
  login: async (req, res, next) => {
    try {
      const { error } = login(req.body);
      if (error) {
        throw createError.BadRequest(error.details[0].message);
      }
      const user = await authService.login(req.body);
      const accessToken = tokenService.generateToken({ id: user._id });
      const refreshToken = await tokenService.generateRefreshToken({
        id: user._id,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        signed: true,
        maxAge: EXPIRE_COOKIE,
        sameSite: process.env.NODE_ENV === "production" ? "none" : true,
        secure: process.env.NODE_ENV === "production",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        signed: true,
        maxAge: EXPIRE_COOKIE,
        sameSite: process.env.NODE_ENV === "production" ? true : "none",
        secure: process.env.NODE_ENV === "production",
      });

      return res.status(200).json({
        id: user.id,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        fullName: user.fullName,
      });
    } catch (error) {
      next(error);
    }
  },

  checkLogged: async (req, res, next) => {
    try {
      const user = await authService.getCurrentUser(req.user);
      return res.status(200).json({
        id: user.id,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        fullName: user.fullName,
      });
    } catch (error) {
      next(error);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.signedCookies;
      if (!refreshToken) {
        throw createError.BadRequest();
      }
      jwt.verify(
        refreshToken,
        process.env.SCRET_REFRESH_TOKEN,
        async (err, decoded) => {
          if (err) {
            throw createError.Unauthorized(err.name);
          }
          const id = decoded.id;
          const accessToken = tokenService.generateToken({ id });
          const refreshToken = await tokenService.generateRefreshToken({
            id,
          });
          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            signed: true,
            maxAge: EXPIRE_COOKIE,
          });

          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,

            signed: true,
            maxAge: EXPIRE_COOKIE,
          });
          return res.status(200).json({ message: "success" });
        }
      );
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.signedCookies;
      if (!refreshToken) {
        throw createError.BadRequest();
      }
      await authService.logout(refreshToken);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(200).json({
        message: "Logout success",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AuthController;
