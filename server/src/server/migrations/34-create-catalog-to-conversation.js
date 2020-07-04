
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CatalogToConversation', {
      CatalogId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Catalogs',
          key: 'id',
        },
      },
      ConversationId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Conversations',
          key: 'id',
        },
      },
    }).then(value => {
      return queryInterface.addConstraint('CatalogToConversation', ['CatalogId', 'ConversationId'], {
        type: 'primary key',
      });
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('CatalogToConversation');
  },
};
