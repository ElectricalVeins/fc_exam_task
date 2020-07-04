
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('BlackList', {
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      blockedId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    }).then(value => {
      return queryInterface.addConstraint('BlackList', ['UserId', 'blockedId'], {
        type: 'primary key',
      });
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('BlackList');
  },
};
