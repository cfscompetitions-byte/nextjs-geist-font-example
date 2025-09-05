module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    token_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    queue_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'queues',
        key: 'id'
      }
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    status: {
      type: DataTypes.ENUM('waiting', 'called', 'serving', 'completed', 'cancelled', 'no_show'),
      defaultValue: 'waiting'
    },
    priority: {
      type: DataTypes.ENUM('normal', 'high', 'urgent'),
      defaultValue: 'normal'
    },
    estimated_call_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    called_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    served_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    service_duration: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notification_sent: {
      type: DataTypes.JSON,
      defaultValue: {
        created: false,
        five_turns: false,
        your_turn: false
      }
    }
  }, {
    tableName: 'tokens',
    hooks: {
      beforeCreate: async (token) => {
        if (!token.token_id) {
          // Generate unique token ID
          const prefix = 'QA';
          const timestamp = Date.now().toString().slice(-6);
          const random = Math.random().toString(36).substr(2, 4).toUpperCase();
          token.token_id = `${prefix}${timestamp}${random}`;
        }
      }
    }
  });

  Token.associate = (models) => {
    Token.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Token.belongsTo(models.Queue, {
      foreignKey: 'queue_id',
      as: 'queue'
    });
  };

  return Token;
};
