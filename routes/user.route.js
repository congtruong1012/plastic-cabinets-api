const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.post("/create", userController.create);
router.get("/list", userController.get);

module.exports = router;
