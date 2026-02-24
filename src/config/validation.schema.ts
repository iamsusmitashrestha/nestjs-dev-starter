import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  API_PREFIX: Joi.string().default('api'),

  // CORS
  CORS_ORIGIN: Joi.string().default('*'),

  // Database
  DATABASE_URL: Joi.string().required(),

  // JWT (RS256 verify-only — public key from Core)
  JWT_PUBLIC_KEY: Joi.string().required(),

  // Rate Limiting
  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(10),

  // Swagger
  SWAGGER_ENABLED: Joi.boolean().default(true),
});
