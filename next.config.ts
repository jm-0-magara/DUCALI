// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Enable server actions if needed
    serverActions: true,
  },
  images: {
    domains: [
      'localhost',
      'ducali-uploads.s3.amazonaws.com', // Add your S3 bucket domain
      'res.cloudinary.com', // If using Cloudinary
    ],
  },
  // API route configuration
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Set file upload limit
    },
    externalResolver: true,
  },
  // Environment variables available to client
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  // Webpack configuration for handling certain packages
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Fix for packages that don't work well with webpack
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    return config;
  },
};

export default nextConfig;