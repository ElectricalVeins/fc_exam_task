'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserToConversation', {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      conversationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Conversations',
          key: 'id',
        },
      },
    }).then(value => {
      return queryInterface.addConstraint('UserToConversation', ['userId', 'conversationId'], {
        type: 'primary key',
      });
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserToConversation');
  }
};