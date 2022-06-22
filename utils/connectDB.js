const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.connect(
      process.env.DB_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (message) => {
        console.log("connect success !!", message);
      }
    );
  } catch (error) {
    console.log("connect fail !", error);
  }
};

module.exports = connectDB;
