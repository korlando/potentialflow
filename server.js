process.on('uncaughtException', (err) => {
  console.log(`uncaughtException: ${err}\n${err.stack}`);
  process.exit(1);
});

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const http = require('http');

const app = express();

const argv = require('minimist')(process.argv.slice(2));
const PORT = Number(argv.p) || Number(argv.port) || 3000;
const production = Boolean(argv.production);
app.set('port', PORT);

if(!production) {
  app.use(require('morgan')('dev'));
}

app.set('trust proxy', 1);
app.disabled('x-powered-by');
app.use(helmet.xssFilter());
app.use(helmet.frameguard('sameorigin'));

app.set('views', './views');
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'www'), {
  index: '',
}));

app.use('/api/v1', require('./routes/api-v1')());
app.use('/', require('./routes/routes')(production));

// error handling
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    status: err.status
  });
});

const server = http.createServer(app);
server.listen(PORT);
server.on('error', (err) => {
  if(err.syscall !== 'listen') {
    throw err;
  }

  switch(err.code) {
    case 'EACCES':
      console.error(`Port ${PORT} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Port ${PORT} is already in use`);
      process.exit(1);
      break;
    default:
      throw err;
  }
});
server.on('listening', () => {
  console.log(`Server listening on port ${PORT}`);
});