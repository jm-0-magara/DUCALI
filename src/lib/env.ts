import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  // Core Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),

  // Database
  DATABASE_URL: z.string().url(),

  // Authentication & Security
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters long'),
  NEXTAUTH_URL: z.string().url(),

  // Payment Processing
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  
  MPESA_CONSUMER_KEY: z.string().optional(),
  MPESA_CONSUMER_SECRET: z.string().optional(),
  MPESA_BUSINESS_SHORT_CODE: z.string().optional(),
  MPESA_PASSKEY: z.string().optional(),
  MPESA_ENVIRONMENT: z.enum(['sandbox', 'live']).optional(),

  // File Upload & Storage
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),

  // Real-time Features
  REDIS_URL: z.string().optional(),

  PUSHER_APP_ID: z.string().optional(),
  PUSHER_KEY: z.string().optional(),
  PUSHER_SECRET: z.string().optional(),
  PUSHER_CLUSTER: z.string().optional(),

  // Search & Analytics
  ALGOLIA_APP_ID: z.string().optional(),
  ALGOLIA_SEARCH_API_KEY: z.string().optional(),
  ALGOLIA_ADMIN_API_KEY: z.string().optional(),

  NEXT_PUBLIC_GA_ID: z.string().optional(),

  // Monitoring & Logging
  SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_LOGROCKET_APP_ID: z.string().optional(),

  // Email & Notifications
  SENDGRID_API_KEY: z.string().optional(),
  SENDGRID_FROM_EMAIL: z.string().email().optional(),

  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),

  // Maps & Location
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),

  // Development Tools
  PRISMA_GENERATE_DATAPROXY: z.string().optional(),

  // Production Settings
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  MAX_FILE_SIZE: z.string().transform(Number).default('10485760'),
  ALLOWED_FILE_TYPES: z.string().default('image/jpeg,image/png,image/webp,application/pdf'),

  // Feature Flags
  ENABLE_REAL_TIME_MESSAGING: z.string().transform(val => val === 'true').default('true'),
  ENABLE_PUSH_NOTIFICATIONS: z.string().transform(val => val === 'true').default('true'),
  ENABLE_ANALYTICS: z.string().transform(val => val === 'true').default('true'),
  ENABLE_MONITORING: z.string().transform(val => val === 'true').default('true'),
});

// Parse and validate environment variables
export const env = envSchema.parse(process.env);

// Helper functions to check if services are configured
export const isStripeConfigured = () => {
  return !!(env.STRIPE_SECRET_KEY && env.STRIPE_PUBLISHABLE_KEY);
};

export const isMpesaConfigured = () => {
  return !!(
    env.MPESA_CONSUMER_KEY &&
    env.MPESA_CONSUMER_SECRET &&
    env.MPESA_BUSINESS_SHORT_CODE &&
    env.MPESA_PASSKEY
  );
};

export const isCloudinaryConfigured = () => {
  return !!(
    env.CLOUDINARY_CLOUD_NAME &&
    env.CLOUDINARY_API_KEY &&
    env.CLOUDINARY_API_SECRET
  );
};

export const isAwsConfigured = () => {
  return !!(
    env.AWS_ACCESS_KEY_ID &&
    env.AWS_SECRET_ACCESS_KEY &&
    env.AWS_REGION &&
    env.AWS_S3_BUCKET
  );
};

export const isRedisConfigured = () => {
  return !!env.REDIS_URL;
};

export const isPusherConfigured = () => {
  return !!(
    env.PUSHER_APP_ID &&
    env.PUSHER_KEY &&
    env.PUSHER_SECRET &&
    env.PUSHER_CLUSTER
  );
};

export const isAlgoliaConfigured = () => {
  return !!(
    env.ALGOLIA_APP_ID &&
    env.ALGOLIA_SEARCH_API_KEY &&
    env.ALGOLIA_ADMIN_API_KEY
  );
};

export const isSendGridConfigured = () => {
  return !!(env.SENDGRID_API_KEY && env.SENDGRID_FROM_EMAIL);
};

export const isTwilioConfigured = () => {
  return !!(
    env.TWILIO_ACCOUNT_SID &&
    env.TWILIO_AUTH_TOKEN &&
    env.TWILIO_PHONE_NUMBER
  );
};

export const isSentryConfigured = () => {
  return !!env.SENTRY_DSN;
};

// Configuration validation on startup
export function validateEnvironment() {
  const errors: string[] = [];

  // Required for all environments
  if (!env.DATABASE_URL) {
    errors.push('DATABASE_URL is required');
  }

  if (!env.JWT_SECRET) {
    errors.push('JWT_SECRET is required');
  }

  if (!env.NEXTAUTH_SECRET) {
    errors.push('NEXTAUTH_SECRET is required');
  }

  // Production-specific requirements
  if (env.NODE_ENV === 'production') {
    if (!isStripeConfigured() && !isMpesaConfigured()) {
      errors.push('At least one payment processor (Stripe or M-Pesa) must be configured in production');
    }

    if (!isCloudinaryConfigured() && !isAwsConfigured()) {
      errors.push('At least one file storage service (Cloudinary or AWS S3) must be configured in production');
    }

    if (!isRedisConfigured()) {
      errors.push('REDIS_URL is required in production for caching and sessions');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }

  console.log('✅ Environment validation passed');
}

// Auto-validate on import
if (typeof window === 'undefined') {
  validateEnvironment();
}
