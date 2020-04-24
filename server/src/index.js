const express=require('express');
import "babel-polyfill";
const router=require('./server/router');
const cors=require('cors');
const controller = require('./socketInit');
const handlerError=require('./server/handlerError/handler');
const CONSTANTS =require('./constants');
const PORT = process.env.PORT || 9632;
const app = express();
const http = require('http');
require('./server/dbMongo/mongoose');


app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));
app.use(router);
app.use(handlerError);

const server=http.createServer(app);
server.listen(3000);
controller.createConnection(server);


