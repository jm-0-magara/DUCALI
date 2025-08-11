import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from './firebase';

// Check if Firebase is properly initialized
if (!auth || !db) {
  console.warn('Firebase not properly initialized. Authentication will not work.');
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'artisan' | 'customer' | 'admin';
  profileImage?: string;
  phone?: string;
  location?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isArtisan: boolean;
  isCustomer: boolean;
  register: (email: string, password: string, name: string, role: 'artisan' | 'customer') => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

// Convert Firebase user to our User interface
const convertFirebaseUser = (firebaseUser: FirebaseUser, userData?: any): User => {
  // Helper function to safely convert Firestore timestamps or regular dates
  const safeDate = (dateValue: any): Date => {
    if (!dateValue) return new Date();
    if (dateValue.toDate && typeof dateValue.toDate === 'function') {
      // It's a Firestore Timestamp
      return dateValue.toDate();
    }
    if (dateValue instanceof Date) {
      // It's already a Date object
      return dateValue;
    }
    // Try to create a Date from the value
    return new Date(dateValue);
  };

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || userData?.name || '',
    role: userData?.role || 'customer',
    profileImage: firebaseUser.photoURL || userData?.profileImage,
    phone: userData?.phone,
    location: userData?.location,
    bio: userData?.bio,
    createdAt: safeDate(userData?.createdAt),
    updatedAt: safeDate(userData?.updatedAt),
  };
};

// Register new user
export const registerUser = async (
  email: string, 
  password: string, 
  name: string, 
  role: 'artisan' | 'customer' | 'admin'
): Promise<User> => {
  if (!auth || !db) {
    throw new Error('Firebase not properly initialized. Please check your configuration.');
  }

  try {
    console.log('Starting registration for:', email);
    
    // Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    console.log('Firebase user created:', firebaseUser.uid);

    // Update display name
    await updateProfile(firebaseUser, { displayName: name });
    console.log('Profile updated with name:', name);

    // Create user document in Firestore (with error handling)
    const userData = {
      name,
      role,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      console.log('User document created in Firestore');
    } catch (firestoreError: any) {
      console.warn('Firestore write failed, but user is still created:', firestoreError.message);
      // Continue with registration even if Firestore fails
    }

    // Wait a moment for Firebase to sync
    await new Promise(resolve => setTimeout(resolve, 500));

    const convertedUser = convertFirebaseUser(firebaseUser, userData);
    console.log('Registration completed successfully:', convertedUser);
    
    return convertedUser;
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(error.message || 'Registration failed');
  }
};

// Login user
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    console.log('Starting login for:', email);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    console.log('Login successful for user:', firebaseUser.uid);

    // Try to get user data from Firestore (with error handling)
    let userData = null;
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        console.warn('User document not found in Firestore, creating basic user data');
        // Create basic user data if document doesn't exist
        const basicUserData = {
          name: firebaseUser.displayName || 'User',
          role: 'customer',
          email: firebaseUser.email || email,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        try {
          await setDoc(doc(db, 'users', firebaseUser.uid), basicUserData);
          userData = basicUserData;
        } catch (firestoreError: any) {
          console.warn('Firestore write failed, using basic data:', firestoreError.message);
          userData = basicUserData;
        }
      } else {
        userData = userDoc.data();
        console.log('User data retrieved from Firestore:', userData);
      }
    } catch (firestoreError: any) {
      console.warn('Firestore read failed, using basic user data:', firestoreError.message);
      // Use basic user data if Firestore fails
      userData = {
        name: firebaseUser.displayName || 'User',
        role: 'customer',
        email: firebaseUser.email || email,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    
    return convertFirebaseUser(firebaseUser, userData);
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Login failed');
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error(error.message || 'Logout failed');
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Update Firestore document
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date(),
    });

    // Update Firebase auth profile if name or photo URL changed
    const currentUser = auth.currentUser;
    if (currentUser && (updates.name || updates.profileImage)) {
      await updateProfile(currentUser, {
        displayName: updates.name || currentUser.displayName,
        photoURL: updates.profileImage || currentUser.photoURL,
      });
    }
  } catch (error: any) {
    console.error('Profile update error:', error);
    throw new Error(error.message || 'Profile update failed');
  }
};

// Get user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data();
    
    // Helper function to safely convert Firestore timestamps or regular dates
    const safeDate = (dateValue: any): Date => {
      if (!dateValue) return new Date();
      if (dateValue.toDate && typeof dateValue.toDate === 'function') {
        // It's a Firestore Timestamp
        return dateValue.toDate();
      }
      if (dateValue instanceof Date) {
        // It's already a Date object
        return dateValue;
      }
      // Try to create a Date from the value
      return new Date(dateValue);
    };

    return {
      id: userDoc.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      profileImage: userData.profileImage,
      phone: userData.phone,
      location: userData.location,
      bio: userData.bio,
      createdAt: safeDate(userData.createdAt),
      updatedAt: safeDate(userData.updatedAt),
    };
  } catch (error: any) {
    console.error('Get user error:', error);
    return null;
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    console.log('Auth state changed - Firebase user:', firebaseUser ? firebaseUser.uid : 'null');
    
    if (firebaseUser) {
      try {
        // Add a small delay to ensure Firestore is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        let userData = null;
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            userData = userDoc.data();
            console.log('Auth state change - User found in Firestore:', userData);
          } else {
            console.log('Auth state change - User document not found, creating basic data');
            // Create basic user data if document doesn't exist
            userData = {
              name: firebaseUser.displayName || 'User',
              role: 'customer',
              email: firebaseUser.email || '',
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            try {
              await setDoc(doc(db, 'users', firebaseUser.uid), userData);
            } catch (firestoreError: any) {
              console.warn('Firestore write failed in auth state change:', firestoreError.message);
            }
          }
        } catch (firestoreError: any) {
          console.warn('Firestore read failed in auth state change:', firestoreError.message);
          // Use basic user data if Firestore fails
          userData = {
            name: firebaseUser.displayName || 'User',
            role: 'customer',
            email: firebaseUser.email || '',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }
        
        const convertedUser = convertFirebaseUser(firebaseUser, userData);
        console.log('Auth state change - Converted user:', convertedUser);
        callback(convertedUser);
      } catch (error) {
        console.error('Auth state change error:', error);
        // Return basic user data even if everything fails
        const basicUserData = {
          name: firebaseUser.displayName || 'User',
          role: 'customer',
          email: firebaseUser.email || '',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const convertedUser = convertFirebaseUser(firebaseUser, basicUserData);
        callback(convertedUser);
      }
    } else {
      console.log('Auth state change - No user, clearing state');
      callback(null);
    }
  });
};
