const express = require("express");
const categoryController = require("../controllers/category.controller");

const router = express.Router();

router.post("/cre-upd", categoryController.creUpd);
router.get("/list", categoryController.getAll);
router.get("/detail", categoryController.get);
router.post("/delete", categoryController.delete);

module.exports = router;
