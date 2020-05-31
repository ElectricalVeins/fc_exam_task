
module.exports = (sequelize, DataTypes) => {
  const ContestDescribe = sequelize.define('ContestDescribe', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    describe: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, { timestamps: false });
  return ContestDescribe;
};
