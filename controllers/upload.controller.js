const createHttpError = require("http-errors");
const uploadServices = require("../services/upload.service");

const uploadController = {
  upload: async (req, res) => {
    //req.files chính là khi upload multiple images
    const files = req.files;
    if (!files) {
      throw createHttpError.BadRequest("Please choose files");
    }
    let res_promises = req.files.map(
      (file) =>
        new Promise((resolve, reject) => {
          uploadServices.uploadMultiple(file.path).then((result) => {
            resolve(result);
          });
        })
    );

    // Promise.all get imgas
    Promise.all(res_promises)
      .then(async (arrImg) => {
        //arrImg chính là array mà chúng ta đã upload
        // các bạn có thể sử dụng arrImg để save vào database, hay hơn thì sử dụng mongodb
        res.json(arrImg);
      })
      .catch((error) => {
        next(error);
      });
  },
};

module.exports = uploadController;
