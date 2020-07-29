require('babel-polyfill');
const controller = require('./socketInit');
const server = require('./boot/startHttpServer');
const CONSTANTS =require('./constants');
const createLogHistory = require('./server/utils/logger/copier');
const PORT = process.env.PORT || 3000;

controller.createConnection(server);
server.listen(PORT);

setInterval(() => {
  createLogHistory(CONSTANTS.LOG_FILE_PATH,
    `${CONSTANTS.DUMPS_PATH}${Date.parse(new Date())}.json`);
}, CONSTANTS.DAY_LENGTH);

startTimers(); // запустить только существующие таймеры.
// новые нужно как то добавлять 
//как вариант - в контроллере
