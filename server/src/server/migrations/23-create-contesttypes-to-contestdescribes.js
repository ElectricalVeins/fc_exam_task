
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('TypeToDescribes', {
      ContestTypeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'ContestTypes',
          key: 'id',
        },
      },
      ContestDescribeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'ContestDescribes',
          key: 'id',
        },
      },
    }).then(value => {
      return queryInterface.addConstraint('TypeToDescribes', ['ContestTypeId', 'ContestDescribeId'], {
        type: 'primary key',
      });
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('TypeToDescribes');
  },
};
