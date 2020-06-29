const CONSTANTS = require('../../constants');
const bcrypt = require('bcrypt');

const pass = bcrypt.hashSync('Test1234', CONSTANTS.SALT_ROUNDS);

module.exports={
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        firstName: 'Moderator',
        lastName: 'Moderator',
        displayName: 'Moderator',
        password: pass,
        email: 'moderator@gmail.com',
        role: CONSTANTS.MODERATOR,
        balance: 0,
        rating: 0,
      },
      {
        firstName: 'test',
        lastName: 'test',
        displayName: 'buyer',
        password: pass,
        email: 'buyer@gmail.com',
        role: 'customer',
        balance: 0,
        rating: 0,
      },
      {
        firstName: 'creative',
        lastName: 'creative',
        displayName: 'creative',
        password: pass,
        email: 'creative@gmail.com',
        role: 'creator',
        balance: 0,
        rating: 0,
      },
    ], {});
  },
};
