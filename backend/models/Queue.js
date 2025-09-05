module.exports = (sequelize, DataTypes) => {
  const Queue = sequelize.define('Queue', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    office_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'offices',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    service_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    current_position: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    total_tokens: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    estimated_wait_time: {
      type: DataTypes.INTEGER, // in minutes
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    average_service_time: {
      type: DataTypes.INTEGER, // in minutes
      defaultValue: 10,
      validate: {
        min: 1
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'paused', 'closed'),
      defaultValue: 'active'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    max_capacity: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
      validate: {
        min: 1,
        max: 200
      }
    }
  }, {
    tableName: 'queues'
  });

  Queue.associate = (models) => {
    Queue.belongsTo(models.Office, {
      foreignKey: 'office_id',
      as: 'office'
    });
    Queue.hasMany(models.Token, {
      foreignKey: 'queue_id',
      as: 'tokens'
    });
  };

  return Queue;
};
