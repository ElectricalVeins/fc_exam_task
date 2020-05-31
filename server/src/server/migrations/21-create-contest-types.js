
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ContestTypes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ContestTypes');
  },
};
