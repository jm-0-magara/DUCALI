// src/lib/create-admin.ts
// Utility function to create an admin user (for development/testing only)

import { registerUser } from './firebase-auth';

export const createAdminUser = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    console.log('Creating admin user:', email);
    const adminUser = await registerUser(email, password, name, 'admin');
    console.log('Admin user created successfully:', adminUser);
    return { success: true, user: adminUser };
  } catch (error: any) {
    console.error('Failed to create admin user:', error);
    return { success: false, error: error.message };
  }
};

// Usage example:
// In browser console or development environment:
// import { createAdminUser } from './lib/create-admin';
// createAdminUser('admin@ducali.com', 'admin123', 'Admin User');
