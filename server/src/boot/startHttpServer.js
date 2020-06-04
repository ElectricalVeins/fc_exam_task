const http = require('http');
const app = require('./startExpress');

const server=http.createServer(app);

module.exports = server;
