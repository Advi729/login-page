var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var {v4: uuidv4} =require('uuid');
var nocache = require('nocache');

var indexRouter = require('./routes/index');
var homeRouter = require('./routes/home');

var app = express();
app.use(nocache());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: uuidv4(),
  resave: false,
  saveUninitialized: true
}));

function check(req, res, next){
  if(req.session.user){
    next();
  }else{
    res.redirect('/')
  }
}

app.use('/', indexRouter);
app.use('/home', check, homeRouter);

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
      if(err) {
          console.log(err);
          res.send("Error");
      } else {
          // req.session.context = 'Logged out successfully.';
          // res.render('index', {logout: 'Logged out successfully.'})
          res.redirect('/');
      }
  })   
})

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

module.exports = app;
