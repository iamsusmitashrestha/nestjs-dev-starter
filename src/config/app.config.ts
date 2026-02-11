import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || 'api',

  // CORS Configuration
  corsOrigin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : ['*'],

  // Rate Limiting
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10),
  },

  // Swagger
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true' || process.env.NODE_ENV !== 'production',
    title: 'Nepali Biz Business API',
    description: 'NestJS API for Nepali Biz Business service',
    version: '1.0.0',
    path: 'docs',
  },
}));
