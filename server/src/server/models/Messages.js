'use strict';
module.exports = (sequelize, DataTypes) => {
  const Messages = sequelize.define('Messages', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    body: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    senderId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    conversationId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Conversations',
        key: 'id',
      },
    }
  }, {timestamps: true});
  Messages.associate = function (models) {
    // associations can be defined here
  };
  return Messages;
};