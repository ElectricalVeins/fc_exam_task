const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configPath = env === 'production' ? path.join(__dirname, '..', '..', '..', 'src/server/config/postgresConfig.json') : path.join(__dirname, '..', '/config/postgresConfig.json');
const config = require(configPath)[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });


db['Contests'].belongsTo(db['Users'], { foreignKey: 'userId', sourceKey: 'id' });
db['Contests'].hasMany(db['Offers'], { foreignKey: 'contestId', targetKey: 'id' });


db['Users'].hasMany(db['Offers'], { foreignKey: 'userId', targetKey: 'id' });
db['Users'].hasMany(db['Contests'], { foreignKey: 'userId', targetKey: 'id' });
db['Users'].hasMany(db['Ratings'], { foreignKey: 'userId', targetKey: 'id' });


db['Offers'].belongsTo(db['Users'], { foreignKey: 'userId', sourceKey: 'id' });
db['Offers'].belongsTo(db['Contests'], { foreignKey: 'contestId', sourceKey: 'id' });
db['Offers'].hasOne(db['Ratings'], { foreignKey: 'offerId', targetKey: 'id' });


db['Ratings'].belongsTo(db['Users'], { foreignKey: 'userId', targetKey: 'id' });
db['Ratings'].belongsTo(db['Offers'], { foreignKey: 'offerId', targetKey: 'id' });


db.ContestType.belongsToMany(db.ContestDescribe, { through: db.TypeToDescribe });
db.ContestDescribe.belongsToMany(db.ContestType, { through: db.TypeToDescribe });


db.Conversations.belongsToMany(db.Users, { through: db.UserToConversation });
db.Users.belongsToMany(db.Conversations, { through: db.UserToConversation });


db.Catalogs.belongsToMany(db.Conversations, { through: db.CatalogToConversation });
db.Conversations.belongsToMany(db.Catalogs, { through: db.CatalogToConversation });


db.Catalogs.belongsToMany(db.Conversations, { through: db.CatalogToConversation });
db.Conversations.belongsToMany(db.Catalogs, { through: db.CatalogToConversation });


db.Users.belongsToMany(db.Users, { through: db.BlackList, as: 'blocked' });
db.Users.belongsToMany(db.Users, { through: db.FavoriteList, as: 'favorite' });


//Messages to Conversations 1:1
db.Messages.hasOne(db.Conversations, { foreignKey: 'id', constraints: false });
db.Messages.hasOne(db.Users, { foreignKey: 'id', constraints: false });

db.Users.hasMany(db.Messages);
db.Users.hasMany(db.Conversations);

db.Conversations.hasMany(db.Messages);
db.Messages.belongsTo(db.Conversations);


sequelize.sync()
  .then(() => {
    console.log('sequelize soft sync has been done');
  })
  .catch(err => console.log(err));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
