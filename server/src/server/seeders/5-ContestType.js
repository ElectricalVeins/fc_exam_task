module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('ContestTypes', [
      {
        type: 'industry',
      },
      {
        type: 'typeOfTagline',
      },
      {
        type: 'nameStyle',
      },
      {
        type: 'typeOfName',
      },
      {
        type: 'brandStyle',
      },
    ], {});
  },
};
