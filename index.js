const express = require("express");
const createError = require("http-errors");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const multer = require("multer");
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const categoryRoutes = require("./routes/category.route");
const productRoutes = require("./routes/product.route");
const { verifyToken, verifyRole } = require("./middleware/verify");
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

const connectDB = async () => {
  try {
     mongoose.connect(process.env.DB_URL, {
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

// handle upload file
// SET STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

//Uploading multiple files
app.post("/upload", upload.array("myFiles", 12), (req, res, next) => {
  const files = req.files;
  if (!files) {
    return next(createError.BadRequest("Please choose files"));
  }
  res.send(files);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
