"use strict";
require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');

const indexRouter = require('./routes/main/index');
const adminRouter = require('./routes/admin/admin');
const mobileRouter = require('./routes/mobile/mobile');

const app = express();

var https = require('https');
var http = require('http');
// var hostname = '192.168.29.248';
// var hostname = '192.168.1.16';
var hostname = '172.20.10.3';

// const httpsLocalhost = require("https-localhost")();
// const app = ...
// const port = 443
// const certs = httpsLocalhost.getCerts();
// https.createServer(certs, app).listen(4433,hostname);

// console.log(server.address());

http.createServer(app).listen(process.env.PORT,hostname);
// https.createServer(certs, app).listen(4433,hostname);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
// app.use(fileUpload({
//   useTempFiles : true,
//   tempFileDir : './temporary'
// }));

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/mobile', mobileRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
