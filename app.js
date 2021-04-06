const os = require("os");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
// const paginate = require("express-paginate");

// Security
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");

// Error handling
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

// Routers
const viewRouter = require("./routes/viewRoutes");
const productRouter = require("./routes/productRoutes");
// const orderRouter = require("./routes/orderRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// //// TEST NEW SETTINGS

// const cores = os.cpus().filter((cpu, index) => {
//   const hasHyperthreading = cpu.model.includes("Intel");
//   const isOdd = index % 2 === 1;
//   return !hasHyperthreading || isOdd;
// });
// const amount = cores.length;

// module.exports = amount;

// ///// END OF TEST

//  SET HTTP HEADERS
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// DEV LOG
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// LIMIT API REQUESTS FROM AN IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, Please try again in an hour!",
});

app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// DATA SANITIZATION against NOSQL Query Injection
app.use(mongoSanitize());

// DATA SANITIZATION against XXS
app.use(xss());

// Prevent Parameter Pollution
app.use(hpp());

app.use(compression());

// Custom Middleware/ TEST
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// MOUNTING ROUTERS
app.use("/", viewRouter);
// app.use("/dashboard", adminRouter);
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/customers", customerRouter);
// app.use("/api/v1/orders", orderRouter);
// app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);

// Errors
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
