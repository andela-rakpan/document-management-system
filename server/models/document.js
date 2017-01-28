module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    access: {
      type: DataTypes.STRING,
      defaultValue: 'private',
    },
  }, {
    classMethods: {
      associate: (models) => {
        Document.belongsTo(models.User, {
          foreignKey: 'ownerId',
          onDelete: 'CASCADE',
        });

        Document.belongsTo(models.Type, {
          foreignKey: 'typeId',
          onDelete: 'CASCADE',
        });
      },
    },
  });
  return Document;
};
