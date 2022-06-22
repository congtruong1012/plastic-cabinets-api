const express = require("express");
const createError = require("http-errors");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const categoryRoutes = require("./routes/category.route");
const productRoutes = require("./routes/product.route");
const orderRoutes = require("./routes/order.route");
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

connectDB();

app.use("/api/user", verifyToken, userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sys/category", categoryRoutes);
app.use("/api/sys/product", verifyToken, productRoutes);
app.use("/api/sys/order", verifyToken, orderRoutes);
app.get("/api/test", verifyToken, (req, res) => {
  res.json({
    message: "ok",
  });
});

// handle upload file
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// SET STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    const extendFile = file.originalname.split(".");
    if (extendFile[1]) cb(null, `${Date.now()}.${extendFile[1]}`);
  },
});

const upload = multer({ storage: storage });

//Uploading multiple files
app.post("/upload", upload.array("myFiles", 12), async (req, res, next) => {
  try {
    const files = req.files;
    if (!files) {
      throw createError.BadRequest("Please choose files");
    }
    const list = [];
    files.map((file) =>
      cloudinary.uploader
        .upload(file.path, { folder: "image" })
        .then((result) => {
          if (result) {
            fs.unlinkSync(file);
            list.push({
              url: result.secure_url,
              id: result.public_id,
            });
          }
        })
    );
    return res.send(list);
  } catch (error) {
    next(error);
  }
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
