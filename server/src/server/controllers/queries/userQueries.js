const db = require('../../models/index');
const NotFound = require('../../errors/UserNotFoundError');
const ServerError = require('../../errors/ServerError');
const bcrypt = require('bcrypt');


module.exports.updateUser = async (data, id, transaction) => {
  const [updatedCount, [updatedUser]] = await db.Users.update(data, { where: { id }, returning: true, transaction });
  if (updatedCount !== 1){
    throw new ServerError(new Error('cannot update user'));
  }
  return updatedUser.dataValues;
};

module.exports.findUser = async (predicate, transaction) => {
  const foundUser = await db.Users.findOne({ where: predicate, transaction });
  if (!foundUser){
    throw new NotFound(new Error('user with this data didn`t exist'));
  }
  else{
    return foundUser.get({ plain: true });
  }
};

module.exports.userCreation = async (data) => {
  const newUser = await db.Users.create(data);
  if (!newUser){
    throw new ServerError(new Error('server error on user creation'));
  }
  else{
    return newUser.get({ plain: true });
  }
};
