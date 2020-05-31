
module.exports = (sequelize, DataTypes) => {
  const ContestType = sequelize.define('ContestType', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, { timestamps: false });
  return ContestType;
};
