const mongoose =require('mongoose');
const path=require('path');
const env = process.env.NODE_ENV || 'development';
const configPath = env === 'production' ? path.join(__dirname, '..', '..', '..', 'src/server/config/mongoConfig.json') : path.join(__dirname, '..', '/config/mongoConfig.json');
const config = require(configPath)[env];


mongoose.connect(`mongodb://${config.host}:27017/${config.database}`, { useNewUrlParser: true }, (err)=>{
  if(err){
    process.exit(1);
  }

});

mongoose.set('debug', true);

module.exports=mongoose;
