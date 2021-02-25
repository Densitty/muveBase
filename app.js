var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const helmet = require("helmet");

var indexRouter = require("./routes/index");

var app = express();

// put on your helmet - adjusted content-security-policy for helmet to allow 3rd party styles and js scripts I trusted
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "maxcdn.bootstrapcdn.com",
        "https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js",
      ],
      styleSrc: [
        "'self'",
        "maxcdn.bootstrapcdn.com",
        "https://fonts.googleapis.com/css",
        "https://fonts.gstatic.com/s/metamorphous/v11/Wnz8HA03aAXcC39ZEX5y133ENSqstTs.woff2",
      ],
      fontSrc: [
        "'self'",
        "maxcdn.bootstrapcdn.com",
        "https://fonts.gstatic.com/s/metamorphous/v11/Wnz8HA03aAXcC39ZEX5y133ENSqstTs.woff2",
        "https://fonts.gstatic.com/s/metamorphous/v11/Wnz8HA03aAXcC39ZEX5y133EOyqs.woff2",
        "https://fonts.gstatic.com/s/swankyandmoomoo/v10/flUlRrKz24IuWVI_WJYTYcqbEsMUZ3kksrnl.woff2",
      ],
    },
  })
);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

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
