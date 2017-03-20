/* eslint-disable no-underscore-dangle */

import bcrypt from 'bcrypt-nodejs';

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
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleId: {
      allowNull: false,
      type: DataTypes.INTEGER
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
    instanceMethods: {
      /**
       * Compare plain password to user's hashed password
       * @method
       * @param {String} password
       * @returns {Boolean} password match: true or false
       */
      validatePassword(password) {
        return bcrypt.compareSync(password, this.password);
      },

      /**
       * Hash the password
       * @method
       * @returns {Void} no return
       */
      hashPassword() {
        const salt = bcrypt.genSaltSync(8);
        this.password = bcrypt.hashSync(this.password, salt);
      }
    },

    hooks: {
      beforeCreate(user) {
        user.hashPassword();
      },

      beforeUpdate(user) {
        if (user._changed.password) {
          user.hashPassword();
        }
      }
    }
  });
  return User;
};
