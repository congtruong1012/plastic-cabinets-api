const express = require("express");
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/verify");

const router = express.Router();

router.post("/login", authController.login);
router.get("/check-logged", verifyToken, authController.checkLogged);
router.get("/refresh-token", authController.refreshToken);
router.get("/logout", authController.logout);

module.exports = router;
