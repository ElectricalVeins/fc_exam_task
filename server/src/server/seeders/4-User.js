const CONSTANTS = require('../../constants');
const bcrypt = require('bcrypt');

const pass = bcrypt.hashSync('Test1234', CONSTANTS.SALT_ROUNDS)

module.exports={
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('User', [
      {
        firstName: 'Moderator',
        lastName: 'Moderator',
        displayName: 'Moderator',
        password: pass,
        email: 'moderator@gmail.com',
        role: CONSTANTS.MODERATOR,
        balance: 0,
        rating: 0,
      }
    ], {});
  },
};
