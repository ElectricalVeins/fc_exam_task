
module.exports = (sequelize, DataTypes) => {
  const TypeToDescribe = sequelize.define('TypeToDescribe', {
    ContestTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ContestTypes',
        key: 'id',
      },
    },
    ContestDescribeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ContestDescribes',
        key: 'id',
      },
    },
  }, { timestamps: false });
  return TypeToDescribe;
};
