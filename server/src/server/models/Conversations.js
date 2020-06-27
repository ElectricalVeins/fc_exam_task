'use strict';
module.exports = (sequelize, DataTypes) => {
  const Conversations = sequelize.define('Conversations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model: 'User',
        key: 'id',
      }
    },
  }, {timestamps: true});
  Conversations.associate = function (models) {
    // associations can be defined here
  };
  return Conversations;
};