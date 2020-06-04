const express=require('express');
const cors=require('cors');
const router=require('../server/router');
const errorHandler=require('../server/middlewares/errorHandlers');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));
app.use(router);
app.use(errorHandler);

module.exports = app;
