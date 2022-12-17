const express = require("express");
const createError = require("http-errors");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const url = require("url");
const qs = require("query-string");
const listEndpoints = require("express-list-endpoints");

const userRoutes = require("./api/user.route");
const authRoutes = require("./api/auth.route");
const categoryRoutes = require("./api/category.route");
const productRoutes = require("./api/product.route");
const orderRoutes = require("./api/order.route");
const uploadRoutes = require("./api/upload.route");
const { verifyToken, verifyRole } = require("./middleware/verify");
const logEvent = require("./utils/logEvent");
const { format } = require("date-fns");
require("./utils/connectDB")();
require("dotenv").config();

const app = express();

app.use(express.static(path.join(__dirname, "/public")));

app.use(bodyParser.json());
app.use(cookieParser(process.env.KEY_COOKIE));

app.use(
  cors({
    origin: process.env.URL_CLIENT,
    credentials: true, //Để bật cookie HTTP qua CORS,
  })
);
app.use((req, res, next) => {
  const send = res.send;

  res.send = (data) => {
    const msg = `
DEBUG [${format(new Date(), "yyyy-MM-dd hh:mm:ss")}]:
--------------------[${req.method}][${res.statusCode}]----------------------
[HEADERS]: ${JSON.stringify(req.headers)}
[URL]: ${decodeURIComponent(
      url.format({
        protocol: req.protocol,
        host: req.get("host"),
        pathname: req.originalUrl,
      })
    )}
[BODY PAYLOAD]: ${JSON.stringify(req.body)}
[BODY DATA]: ${JSON.stringify(data)}
`;
    logEvent(msg);
    res.send = send; // this line is important not to have an infinite loop
    console.log("env", process.env);

    return res.send(data);
  };

  next();
});

app.use("/api/user", verifyRole, userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sys/category", verifyToken, categoryRoutes);
app.use("/api/sys/product", verifyToken, productRoutes);
app.use("/api/sys/order", verifyToken, orderRoutes);
app.use("/upload", verifyToken, uploadRoutes);

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  return res.json({
    status: err.status || 500,
    message: err.message || "Internal Server Error",
  });
});

console.log(
  listEndpoints(app)
    .map((route) => `[Mapped] ${route.path} - ${route.methods}`)
    .join("\n")
);

const PORT = process.env.PORT || 3000;

console.log("end", app.get("env"));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
