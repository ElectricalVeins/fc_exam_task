
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('FavoriteList', {
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      favoriteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    }).then(value => {
      return queryInterface.addConstraint('FavoriteList', ['UserId', 'favoriteId'], { type: 'primary key' });
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('FavoriteList');
  },
};
