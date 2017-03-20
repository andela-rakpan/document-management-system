module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    access: {
      type: DataTypes.STRING,
      defaultValue: 'public',
      allowNull: false,
      validate: {
        isIn: [['private', 'public', 'role']]
      }
    },
    ownerId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    typeId: {
      allowNull: false,
      type: DataTypes.INTEGER
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
