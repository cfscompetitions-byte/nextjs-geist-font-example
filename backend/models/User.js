const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isNumeric: true,
        len: [10, 15]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true // Null for citizens who only use WhatsApp
    },
    role: {
      type: DataTypes.ENUM('citizen', 'staff', 'admin'),
      defaultValue: 'citizen',
      allowNull: false
    },
    office_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'offices',
        key: 'id'
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password') && user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      }
    }
  });

  User.prototype.validatePassword = async function(password) {
    if (!this.password) return false;
    return await bcrypt.compare(password, this.password);
  };

  User.associate = (models) => {
    User.belongsTo(models.Office, {
      foreignKey: 'office_id',
      as: 'office'
    });
    User.hasMany(models.Token, {
      foreignKey: 'user_id',
      as: 'tokens'
    });
  };

  return User;
};
