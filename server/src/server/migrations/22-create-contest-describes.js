
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ContestDescribes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      describe: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ContestDescribes');
  },
};
