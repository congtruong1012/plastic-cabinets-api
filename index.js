const express = require("express");
const createError = require("http-errors");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const categoryRoutes = require("./routes/category.route");
const productRoutes = require("./routes/product.route");
const { verifyToken, verifyRole } = require("./middleware/verify");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, //Để bật cookie HTTP qua CORS
  })
);
app.use(bodyParser.json());
app.use(cookieParser("plastic-cabinets"));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connect success !!");
  } catch (error) {
    console.log("connect fail !", error);
  }
};

connectDB();

app.use("/api/user", verifyToken, userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sys/category", categoryRoutes);
app.use("/api/sys/product", productRoutes);
app.get("/api/test", verifyToken, (req, res) => {
  res.json({
    message: "ok",
  });
});

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  return res.json({
    status: err.status || 500,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
