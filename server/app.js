const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

const flowTest = require('./utils/flowTest');

const authRouters = require('./routers/authRoutes');
const gameRouters = require('./routers/gameRoutes');

// Global pre-processing
app.use(
  // make cookies readable by express
  cookieParser(),
  // make body readable by express
  express.json(),
  // debugging assistant
  flowTest,
  // serve files from assets folder
  express.static(path.resolve(__dirname, '../build')),
  // (req, res, next) => console.log(res.headers),
);

app.use('/auth', authRouters);
app.use('/game', gameRouters);

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = { ...defaultErr, ...err };
  // console.log(errorObj);
  return res.status(errorObj.status).json(errorObj.message);
});

module.exports = app;
