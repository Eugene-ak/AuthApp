var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const expressListRoutes = require('express-list-routes');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use("/api/user", usersRouter);
// Custom routes
app.use("/auth", require("./routes/auth"));
app.use("/news", require("./routes/news"));
app.use("/momo/auth", require("./routes/momo"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

try {
  const uri = process.env.MONGODB_CONN_STR || "mongodb://localhost:27017";
  mongoose.set("strictQuery", false);
  const dbName = process.env.DBNAME;
  mongoose.connect(
    uri,
    {
      dbName,
    });
    console.log("Established connection to database");
} catch (error) {
  
}

expressListRoutes(app, { prefix: '/api' });

module.exports = app;
