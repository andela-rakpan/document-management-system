module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    classMethods: {
      associate: (models) => {
        User.hasMany(models.Document, {
          foreignKey: 'ownerId',
          as: 'documents',
        });

        User.belongsTo(models.Role, {
          foreignKey: 'roleId',
          onDelete: 'CASCADE',
        });
      },
    },
  });
  return User;
};
