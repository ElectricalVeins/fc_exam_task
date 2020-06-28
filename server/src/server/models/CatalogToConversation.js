
module.exports = (sequelize, DataTypes) => {
  const CatalogToConversation = sequelize.define('CatalogToConversation', {
    CatalogId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Catalogs',
        key: 'id',
      },
    },
    ConversationId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Conversations',
        key: 'id',
      },
    },
  }, { timestamps: false });
  return CatalogToConversation;
};
