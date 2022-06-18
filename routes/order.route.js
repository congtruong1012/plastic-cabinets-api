const express = require("express");
const orderController = require("../controllers/order.controller");

const router = express.Router();

router.post("/create-order", orderController.createOrder);
router.get("/newest-order", orderController.getNewestOrder);
router.get("/dashboard", orderController.getDashboardOrder);

module.exports = router;
