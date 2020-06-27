'use strict';
module.exports = (sequelize, DataTypes) => {
  const CatalogToConversation = sequelize.define('CatalogToConversation', {
    catalogId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Catalogs',
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
  }, {timestamps: false});
  return CatalogToConversation;
};