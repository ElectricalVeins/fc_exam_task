'use strict';
module.exports = (sequelize, DataTypes) => {
  const FavoriteList = sequelize.define('FavoriteList', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      }
    },
    favoriteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      }
    }
  }, {timestamps: false});
  return FavoriteList;
};