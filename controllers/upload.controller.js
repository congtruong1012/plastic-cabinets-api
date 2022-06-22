const createHttpError = require("http-errors");
const uploadServices = require("../services/upload.service");

const uploadController = {
  upload: async (req, res) => {
    try {
      const files = req.files;
      if (!files) {
        throw createHttpError.BadRequest("Please choose files");
      }
      const res_promises = files.map(
        (file) =>
          new Promise((resolve, reject) => {
            uploadServices.uploadMultiple(file.path).then((result) => {
              resolve(result);
            });
          })
      );

      // Promise.all get imgas
      const rs = await Promise.all(res_promises);
      return res.json(rs);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = uploadController;
