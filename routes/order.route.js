const express = require("express");
const orderController = require("../controllers/order.controller");

const router = express.Router();

router.post("/create-order", orderController.createOrder);
router.get("/newest-order", orderController.getNewestOrder);
router.get("/dashboard", orderController.getDashboardOrder);
router.get("/turnover", orderController.getTurnoverOrder);
router.get("/list", orderController.getListOrder);
router.post("/confirm", orderController.confirmOrder);
router.post("/cancel", orderController.cancelOrder);
router.post("/deliver", orderController.deliverOrder);

module.exports = router;
