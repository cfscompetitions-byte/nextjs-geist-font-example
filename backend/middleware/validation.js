const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    next();
  };
};

// Validation schemas
const schemas = {
  // User registration
  registerUser: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    phone: Joi.string().pattern(/^\d{10,15}$/).required(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    role: Joi.string().valid('citizen', 'staff', 'admin').default('citizen')
  }),

  // User login
  loginUser: Joi.object({
    phone: Joi.string().pattern(/^\d{10,15}$/).required(),
    password: Joi.string().required()
  }),

  // Token booking
  bookToken: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    phone: Joi.string().pattern(/^\d{10,15}$/).required(),
    queue_id: Joi.string().uuid().required(),
    priority: Joi.string().valid('normal', 'high', 'urgent').default('normal')
  }),

  // Office creation
  createOffice: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    location: Joi.string().min(5).max(200).required(),
    address: Joi.string().optional(),
    queue_capacity: Joi.number().integer().min(1).max(1000).default(100),
    operating_hours: Joi.object().optional(),
    services: Joi.array().items(Joi.string()).optional(),
    contact_phone: Joi.string().pattern(/^\d{10,15}$/).optional(),
    contact_email: Joi.string().email().optional()
  }),

  // Queue creation
  createQueue: Joi.object({
    office_id: Joi.string().uuid().required(),
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().optional(),
    service_type: Joi.string().required(),
    max_capacity: Joi.number().integer().min(1).max(200).default(50),
    average_service_time: Joi.number().integer().min(1).default(10)
  }),

  // Update token status
  updateTokenStatus: Joi.object({
    status: Joi.string().valid('waiting', 'called', 'serving', 'completed', 'cancelled', 'no_show').required(),
    notes: Joi.string().optional()
  }),

  // WhatsApp webhook
  whatsappWebhook: Joi.object({
    object: Joi.string().required(),
    entry: Joi.array().items(
      Joi.object({
        id: Joi.string().required(),
        changes: Joi.array().items(
          Joi.object({
            value: Joi.object({
              messaging_product: Joi.string(),
              metadata: Joi.object(),
              contacts: Joi.array().optional(),
              messages: Joi.array().optional()
            }).required(),
            field: Joi.string().required()
          })
        ).required()
      })
    ).required()
  })
};

module.exports = {
  validate,
  schemas
};
