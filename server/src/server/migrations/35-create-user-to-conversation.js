
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserToConversation', {
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      ConversationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Conversations',
          key: 'id',
        },
      },
    }).then(value => {
      return queryInterface.addConstraint('UserToConversation', ['UserId', 'ConversationId'], {
        type: 'primary key',
      });
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserToConversation');
  },
};
