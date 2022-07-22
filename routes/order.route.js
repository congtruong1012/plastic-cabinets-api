const express = require("express");
const orderController = require("../controllers/order.controller");
const { verifyRoleAdmin } = require("../middleware/verify");

const router = express.Router();

router.post("/create-order", orderController.createOrder);
router.get("/newest-order", orderController.getNewestOrder);
router.get("/dashboard", orderController.getDashboardOrder);
router.get("/turnover", orderController.getTurnoverOrder);
router.get("/list", orderController.getListOrder);
router.post("/confirm", verifyRoleAdmin, orderController.confirmOrder);
router.post("/cancel", verifyRoleAdmin, orderController.cancelOrder);
router.post("/deliver", verifyRoleAdmin, orderController.deliverOrder);

module.exports = router;
