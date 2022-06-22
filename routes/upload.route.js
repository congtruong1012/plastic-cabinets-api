const express = require("express");
const uploadController = require("../controllers/upload.controller");
const upload = require("../utils/multerConfig");
const router = express.Router();

router.post("/", upload.array("myFiles", 5), uploadController.upload);

module.exports = router;
