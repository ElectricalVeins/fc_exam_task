const http = require('http');
const express=require('express');
const cors=require('cors');
require('./server/dbMongo/mongoose');
require('babel-polyfill');
const router=require('./server/router');
const controller = require('./socketInit');
const errorHandler=require('./server/middlewares/errorHandlers');
const CONSTANTS =require('./constants');
const createLogHistory = require('./server/utils/logger/copier');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));
app.use(router);
app.use(errorHandler);

const server=http.createServer(app);
server.listen(PORT);
controller.createConnection(server);

setInterval(() => {
  createLogHistory(CONSTANTS.LOG_FILE_PATH,
    `${CONSTANTS.DUMPS_PATH}${Date.parse(new Date())}.json`);
}, CONSTANTS.DAY_LENGTH);
