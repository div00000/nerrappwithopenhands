export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'nerra',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },

  auth0: {
    domain: process.env.AUTH0_DOMAIN || '',
    clientId: process.env.AUTH0_CLIENT_ID || '',
    clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
    audience: process.env.AUTH0_AUDIENCE || '',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-jwt-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  otp: {
    expiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10),
    length: parseInt(process.env.OTP_LENGTH || '6', 10),
    maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '3', 10),
  },

  pin: {
    length: parseInt(process.env.PIN_LENGTH || '4', 10),
    maxAttempts: parseInt(process.env.PIN_MAX_ATTEMPTS || '5', 10),
    lockoutMinutes: parseInt(process.env.PIN_LOCKOUT_MINUTES || '30', 10),
  },

  rateLimit: {
    loginAttempts: parseInt(process.env.RATE_LIMIT_LOGIN_ATTEMPTS || '5', 10),
    otpRequests: parseInt(process.env.RATE_LIMIT_OTP_REQUESTS || '10', 10),
    transfers: parseInt(process.env.RATE_LIMIT_TRANSFERS || '20', 10),
  },

  providers: {
    payout: {
      flutterwave: {
        secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
        publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY,
        baseUrl: process.env.FLUTTERWAVE_BASE_URL || 'https://api.flutterwave.com/v3',
      },
      paystack: {
        secretKey: process.env.PAYSTACK_SECRET_KEY,
        publicKey: process.env.PAYSTACK_PUBLIC_KEY,
        baseUrl: process.env.PAYSTACK_BASE_URL || 'https://api.paystack.co',
      },
      mono: {
        secretKey: process.env.MONO_SECRET_KEY,
        baseUrl: process.env.MONO_BASE_URL || 'https://api.withmono.com/v1',
      },
    },
    funding: {
      flutterwave: {
        secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
        publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY,
      },
      paystack: {
        secretKey: process.env.PAYSTACK_SECRET_KEY,
      },
    },
  },

  s3: {
    bucket: process.env.S3_BUCKET || 'nerra-documents',
    region: process.env.S3_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },

  mail: {
    host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM || 'noreply@nerra.app',
  },

  sms: {
    provider: process.env.SMS_PROVIDER || 'termii',
    apiKey: process.env.SMS_API_KEY,
    senderId: process.env.SMS_SENDER_ID || 'Nerra',
  },

  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@nerra.app',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  },

  allowedOrigins: process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:8081',
});
