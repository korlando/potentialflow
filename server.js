const cluster = require('cluster');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const http = require('http');

if(cluster.isMaster) {
  cluster.fork();
  cluster.on('exit', (worker, code, signal) => {
    if(signal) {
      console.log(`Worker ${worker.id} killed by signal: ${signal}`);
    } else if(code !== 0) {
      console.log(`Workder ${worker.id} exited with error code: ${code}`);
    }
    cluster.fork();
  });
} else {
  const app = express();

  const argv = require('minimist')(process.argv.slice(2));
  const PORT = Number(argv.p) || Number(argv.port) || 3000;
  const PRODUCTION = Boolean(argv.production);
  app.set('port', PORT);

  if(!PRODUCTION) {
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
    index: ''
  }));

  app.use('/', require('./routes/routes'));

  const server = http.createServer(app);
  server.listen(PORT);
  server.on('error', () => {
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

  process.on('uncaughtException', (err) => {
    console.log(`uncaughtException: ${err}\n${err.stack}`);
    process.exit(1);
  });
}