const multer = require("multer");
const express = require("express");
const path = require("path");

// SET STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    const extendFile = file.originalname.split(".");
    if (extendFile[1]) cb(null, `${Date.now()}.${extendFile[1]}`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
