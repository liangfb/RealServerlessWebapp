const serverless = require('serverless-http');
var express = require('express');
var cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var goods = require('./routes/goods');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(cors({credentials: true, origin: true}));
app.use(cors({credentials: true, origin: 'http://slswebsite.s3-website-us-east-1.amazonaws.com'}));

// 访问拦截
app.use(function(req,res,next){

  /*
  res.append('Access-Control-Allow-Credentials', 'true');
  res.append('Access-Control-Allow-Origin', ['http://slswebsite.s3-website-us-east-1.amazonaws.com']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.append('Access-Control-Allow-Headers', 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with');
  */
  if(req.cookies.userId){
    console.log('Cookie:' + req.cookies.userId);
    next();
  }
  else {
    console.log('origin url is:' + req.originalUrl);
    
    if(req.originalUrl.indexOf('/users/login') >= 0 || req.originalUrl.indexOf('/users/logout') >=0 || req.originalUrl.indexOf('/goods/list') >=0) {
      next();
    }
    else{
      
      res.json({
        status:'1',
        msg:'当前未登录',
        result:''
      })
      
    }
  }
})


app.use('/', index);
app.use('/users', users);
app.use('/goods', goods);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

//module.exports = app;
module.exports.handler = serverless(app);
