import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser, findUserById, prisma } from './database';
import { env } from './env';

const JWT_EXPIRES_IN = '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateJWT(payload: JWTPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export async function authenticateUser(email: string, password: string) {
  try {
    const user = await findUserByEmail(email);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid password' };
    }

    const token = generateJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove password from user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
      token,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

export async function registerUser(userData: {
  email: string;
  password: string;
  name: string;
  role: 'CUSTOMER' | 'ARTISAN';
  phone?: string;
  location?: string;
  bio?: string;
  specialty?: string;
  category?: string;
}) {
  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
      return { success: false, error: 'User already exists' };
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create user
    const user = await createUser({
      ...userData,
      password: hashedPassword,
    });

    // If user is an artisan, create artisan profile
    if (userData.role === 'ARTISAN' && userData.specialty && userData.category) {
      await prisma.artisanProfile.create({
        data: {
          userId: user.id,
          specialty: userData.specialty,
          category: userData.category,
          skills: [],
          languages: ['English'],
        },
      });
    }

    // Generate JWT token
    const token = generateJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove password from user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
      token,
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed' };
  }
}

export async function validateToken(token: string) {
  try {
    const payload = verifyJWT(token);
    if (!payload) {
      return { success: false, error: 'Invalid token' };
    }

    const user = await findUserById(payload.userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Remove password from user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return { success: false, error: 'Token validation failed' };
  }
}

// Middleware for protecting API routes
export async function authenticateRequest(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, error: 'No token provided' };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const result = await validateToken(token);
    
    return result;
  } catch (error) {
    console.error('Request authentication error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

// Helper function to get user from request
export async function getUserFromRequest(request: Request) {
  const authResult = await authenticateRequest(request);
  if (!authResult.success) {
    return null;
  }
  return authResult.user;
}
