module.exports = (sequelize, DataTypes) => {
  const Type = sequelize.define('Type', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    classMethods: {
      associate: (models) => {
        Type.hasMany(models.Document, {
          foreignKey: 'typeId',
          as: 'documents',
        });
      },
    },
  });
  return Type;
};
