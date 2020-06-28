
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CatalogToConversation', {
      catalogId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Catalogs',
          key: 'id',
        },
      },
      conversationId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Conversations',
          key: 'id',
        },
      },
    }).then(value => {
      return queryInterface.addConstraint('CatalogToConversation', ['catalogId', 'conversationId'], {
        type: 'primary key',
      });
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('CatalogToConversation');
  },
};
