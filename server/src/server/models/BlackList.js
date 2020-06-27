'use strict';
module.exports = (sequelize, DataTypes) => {
  const BlackList = sequelize.define('BlackList', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      }
    },
    blockedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      }
    }
  }, {timestamps: false});
  return BlackList;
};