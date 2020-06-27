'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserToConversation = sequelize.define('UserToConversation', {
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    conversationId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    }
  }, {timestamps: false});
  return UserToConversation;
};