
module.exports = (sequelize, DataTypes) => {
  const UserToConversation = sequelize.define('UserToConversation', {
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    ConversationId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  }, { timestamps: false });
  return UserToConversation;
};
