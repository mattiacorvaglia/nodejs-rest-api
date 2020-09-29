#!/usr/bin/env node

// ----------------------------------------------------------------------------
// Module Dependencies
var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const MongoClient = require('mongodb').MongoClient;
var debug = require('debug')('nodejs-api-server:server');
var http = require('http');
var compression = require('compression');
const path = require('path');

var fooRouter = require('./routes/foo');
var barRouter = require('./routes/bar');

// ----------------------------------------------------------------------------
// Express App Initialization
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.set('trust proxy', 'loopback');
app.set('port', normalizePort(process.env.PORT || '3000'));
app.use(express.static(path.join(__dirname, 'public')));

// ----------------------------------------------------------------------------
// Database Connection
const dbUriDefault = "mongodb+srv://USER:PASSWORD@HOSTNAME/DATABASE";
const dbNameDefault = 'foo';
const dbUri = process.env.DATASOURCE_URI || dbUriDefault;
const dbName = process.env.DATASOURCE_DB_NAME || dbNameDefault;
const dbClient = new MongoClient(dbUri, { useUnifiedTopology: true });

dbClient.connect().then(client => {
  app.locals.db = client.db(dbName);
  console.log('Database Connection Succesfully Established');
}).catch(error => console.error(error));

// ----------------------------------------------------------------------------
// Routes
app.use('/api/v1/foo', fooRouter);
app.use('/api/v1/bar', barRouter);

// ----------------------------------------------------------------------------
// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// ----------------------------------------------------------------------------
// Error handler
app.use(function(err, req, res, next) {
  if (req.app.get('env') === 'development') console.error(err);
  res.status(err.status || 500);
  res.json({ "error": err.message });
});

// ----------------------------------------------------------------------------
// Start listening for HTTP Request
var server = http.createServer(app);
server.listen(app.get('port'));
server.on('error', onError);
server.on('listening', onListening);

// ----------------------------------------------------------------------------
// Normalize a port into a number, string, or false.
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) return val; // named pipe
  if (port >= 0) return port; // port number
  return false;
}

// ----------------------------------------------------------------------------
// Event listener for HTTP server "error" event.
function onError(error) {
  if (error.syscall !== 'listen') throw error;
  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// ----------------------------------------------------------------------------
// Event listener for HTTP server "listening" event
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

// ----------------------------------------------------------------------------
// Listen for the signal interruption (ctrl-c)
process.on('SIGINT', () => {
  dbClient.close();
  console.log('Database Connection Closed');
  process.exit();
});