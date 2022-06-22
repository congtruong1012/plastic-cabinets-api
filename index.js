const express = require("express");
const createError = require("http-errors");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const categoryRoutes = require("./routes/category.route");
const productRoutes = require("./routes/product.route");
const orderRoutes = require("./routes/order.route");
const uploadRoutes = require("./routes/upload.route");
const { verifyToken, verifyRole } = require("./middleware/verify");
require("./utils/connectDB")();
require("dotenv").config();

const app = express();

app.use(express.static(path.join(__dirname, "/public")));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, //Để bật cookie HTTP qua CORS
  })
);
app.use(bodyParser.json());
app.use(cookieParser("plastic-cabinets"));

app.use("/api/user", verifyToken, userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sys/category", categoryRoutes);
app.use("/api/sys/product", verifyToken, productRoutes);
app.use("/api/sys/order", verifyToken, orderRoutes);
app.use("/upload", uploadRoutes);
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
