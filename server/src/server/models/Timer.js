module.exports = (sequelize, DataTypes) => {
  const Timers = sequelize.define('Timers', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model: 'Users',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    finalDate: {
      type: DataTypes.DATE,
      allowNull:false,
    },
    warnDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },{
    paranoid: true,
  });
  
  return Timers;
};
