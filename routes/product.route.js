const express = require("express");
const productController = require("../controllers/product.controller");
const { verifyRoleAdmin } = require("../middleware/verify");

const router = express.Router();

router.post("/cre-upd", verifyRoleAdmin, productController.creUpd);
router.get("/list", productController.getAll);
router.get("/detail", productController.get);
router.post("/delete", verifyRoleAdmin, productController.delete);

module.exports = router;
