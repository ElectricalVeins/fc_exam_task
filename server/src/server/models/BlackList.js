
module.exports = (sequelize, DataTypes) => {
  const BlackList = sequelize.define('BlackList', {
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    blockedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  }, { timestamps: false });
  return BlackList;
};
