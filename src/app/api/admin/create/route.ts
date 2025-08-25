import { NextRequest, NextResponse } from 'next/server';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../../lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Check if auth is initialized
    if (!auth) {
      return NextResponse.json(
        { error: 'Authentication service not initialized' },
        { status: 500 }
      );
    }

    // Check if db is initialized
    if (!db) {
      return NextResponse.json(
        { error: 'Database service not initialized' },
        { status: 500 }
      );
    }

    // Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Update display name
    await updateProfile(firebaseUser, { displayName: name });

    // Create user document in Firestore
    const userData = {
      id: firebaseUser.uid,
      email: email,
      name: name,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: true,
      status: 'active'
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), userData);

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: firebaseUser.uid,
        email: email,
        name: name,
        role: 'admin'
      }
    });

  } catch (error: any) {
    console.error('Error creating admin:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create admin user', details: error.message },
      { status: 500 }
    );
  }
}
