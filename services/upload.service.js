const cloudinary = require("../utils/cloudinaryConfig");
const fs = require("fs");

const uploadMultiple = (file) => {
  return new Promise((resolve) => {
    cloudinary.uploader
      .upload(file, {
        folder: "image",
      })
      .then((result) => {
        if (result) {
          fs.unlinkSync(file);
          resolve({
            url: result.secure_url,
            id: result.public_id,
          });
        }
      });
  });
};

module.exports = { uploadMultiple };
