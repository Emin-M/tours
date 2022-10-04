const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config({
  path: "./config.env"
});
const GlobalError = require("./error/GlobalError");
const errorHandler = require("./error/errorHandler");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

//!Routers:
const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");
const reviewRouter = require("./routes/reviewRouter");

const app = express();

//! limiter settings
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

//! middlewares
app.use(limiter);
app.use(helmet());
app.use(cors());
app.use(express.json());

//! using morgan at development mode
if (process.env.NODE_ENV.trim() === "development") {
  app.use(morgan("dev"));
};

//! routers
app.use("/api/v1/tour", tourRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/review", reviewRouter);

//! throwing error when route does not exist
app.use((req, res, next) => {
  next(new GlobalError(`${req.originalUrl} does not exist!`, 500));
});

//! Global Error Handler
app.use(errorHandler);

//! Start application:
const DB = process.env.DB_STRING.replace("<password>", process.env.DB_PASSWORD);

mongoose.connect(DB, (err) => {
  if (err) return console.log(err);

  console.log("MongoDb connected.");

  const PORT = process.env.PORT;
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}.`));
});