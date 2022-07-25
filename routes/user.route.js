const express = require("express");
const userController = require("../controllers/user.controller");
const { verifyRoleAdmin } = require("../middleware/verify");

const router = express.Router();

router.post("/create", verifyRoleAdmin, userController.create);
router.get("/list", userController.get);
router.post("/set-role", userController.setRoleMember);
router.post("/remove-role", userController.removeRoleMember);

module.exports = router;
