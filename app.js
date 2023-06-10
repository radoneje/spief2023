var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./config.json');

var indexRouter = require('./routes/index');

const knex = require('knex')({
  client: 'pg',
  connection: config.pgConnection,
  searchPath: ['knex', 'public'],
});

const TelegramBot = require('node-telegram-bot-api');
const token = '6067969380:AAHognfYT5RhESuaK4N6RSfj26EuB8nBDis';
const bot = new TelegramBot(token, {polling: true});
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message\n', chatId);
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/spief2023",express.static(path.join(__dirname, 'public')));
app.use('/', (req, res,next)=>{
  req.knex=knex;

  next();
});
app.use('/', indexRouter);
app.use('/spief2023', indexRouter);

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
