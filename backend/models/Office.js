module.exports = (sequelize, DataTypes) => {
  const Office = sequelize.define('Office', {
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
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 200]
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    queue_capacity: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      validate: {
        min: 1,
        max: 1000
      }
    },
    operating_hours: {
      type: DataTypes.JSON,
      defaultValue: {
        monday: { open: '09:00', close: '17:00' },
        tuesday: { open: '09:00', close: '17:00' },
        wednesday: { open: '09:00', close: '17:00' },
        thursday: { open: '09:00', close: '17:00' },
        friday: { open: '09:00', close: '17:00' },
        saturday: { open: '09:00', close: '13:00' },
        sunday: { open: null, close: null }
      }
    },
    services: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    contact_phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isNumeric: true,
        len: [10, 15]
      }
    },
    contact_email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    }
  }, {
    tableName: 'offices'
  });

  Office.associate = (models) => {
    Office.hasMany(models.User, {
      foreignKey: 'office_id',
      as: 'staff'
    });
    Office.hasMany(models.Queue, {
      foreignKey: 'office_id',
      as: 'queues'
    });
  };

  return Office;
};
