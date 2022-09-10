const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config({
  path: "./config.env"
});

//!Routers:
const tourRouter = require("./routes/tourRouter");

const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV.trim() === "development") {
  app.use(morgan("dev"));
};

app.use("/api/v1/tour", tourRouter);

app.use((req, res) => {
  res.json({
    success: false,
    message: `${req.originalUrl} does not exist!`,
  });
});

//! Start application:
const DB = process.env.DB_STRING.replace("<password>", process.env.DB_PASSWORD);

mongoose.connect(DB, (err) => {
  if (err) return console.log(err);

  console.log("MongoDb connected.");

  const PORT = process.env.PORT;
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}.`));
});