import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  database: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/sports-roz',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || '1h',
    refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d',
  },
};
