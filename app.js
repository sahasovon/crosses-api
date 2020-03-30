const createError = require("http-errors");
const express = require("express");
const mongoose = require('mongoose');
const path = require("path");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const dotenv = require('dotenv');
dotenv.config();

// Router Definition
const indexRouter = require("./app/index");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Enable other libraries
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// SET UP DATABASE
// Configure mongoose's promise to global promise
mongoose.promise = global.Promise;
mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DBNAME}`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false },
    () => console.log('MongoDB --  database connection established successfully!'))
    .catch(err => {
      console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
      process.exit();
    });

// Router Declaration
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
