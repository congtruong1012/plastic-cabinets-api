const express = require("express");
const productController = require("../controllers/product.controller");

const router = express.Router();

router.post("/cre-upd", productController.creUpd);
router.get("/list", productController.getAll);
router.get("/detail", productController.get);
router.post("/delete", productController.delete);

module.exports = router;
