const express = require("express");
const categoryController = require("../controllers/category.controller");
const { verifyRoleAdmin } = require("../middleware/verify");

const router = express.Router();

router.post("/cre-upd", verifyRoleAdmin, categoryController.creUpd);
router.get("/list", categoryController.getList);
router.get("/all", categoryController.getAll);
router.get("/detail", categoryController.get);
router.post("/delete", verifyRoleAdmin, categoryController.delete);

module.exports = router;
