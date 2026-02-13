import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
  User,
  UserCredential
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

/**
 * FIREBASE CONFIGURATION
 * Checks for environment variables. If missing, falls back to Demo/Mock mode.
 */
const hasFirebaseConfig = !!process.env.FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

let app: any;
let auth: any;
let db: any;
let googleProvider: any;

if (hasFirebaseConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    console.log("Firebase Initialized Successfully");
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
  }
} else {
  console.warn("⚠️ FIREBASE_API_KEY not found. App running in DEMO MODE (Mock Data).");
}

// --- Mock Implementations for Demo Mode ---
const MOCK_DELAY = 800;
const mockUser: User = {
  uid: 'demo-user-123',
  displayName: 'مستخدم تجريبي',
  email: 'demo@influtools.com',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  phoneNumber: null,
  photoURL: null,
  tenantId: null,
  refreshToken: '',
  delete: async () => {},
  getIdToken: async () => 'mock-token',
  getIdTokenResult: async () => ({} as any),
  reload: async () => {},
  toJSON: () => ({}),
};

// Internal Mock State
const mockAuthListeners: Array<(user: User | null) => void> = [];

// --- Auth API ---

export const loginWithGoogle = async () => {
  if (auth) {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  }
  // Mock Logic
  console.log("[Demo] Logging in with Google...");
  await new Promise(r => setTimeout(r, MOCK_DELAY));
  mockAuthListeners.forEach(listener => listener(mockUser));
  return mockUser;
};

export const loginWithEmail = async (email: string, pass: string) => {
  if (auth) {
    return await signInWithEmailAndPassword(auth, email, pass);
  }
  // Mock Logic
  console.log("[Demo] Logging in with Email...");
  await new Promise(r => setTimeout(r, MOCK_DELAY));
  
  if (email.includes('error')) throw new Error("بيانات الدخول غير صحيحة (تجريبي)");
  
  const user = { ...mockUser, email };
  mockAuthListeners.forEach(listener => listener(user as User));
  return { user } as UserCredential;
};

export const registerWithEmail = async (email: string, pass: string) => {
  if (auth) {
    return await createUserWithEmailAndPassword(auth, email, pass);
  }
  // Mock Logic
  console.log("[Demo] Registering...");
  await new Promise(r => setTimeout(r, MOCK_DELAY));
  const user = { ...mockUser, email, displayName: '' }; // Name updated later
  
  // In real Firebase, registration signs you in automatically.
  // We will simulate that here.
  mockAuthListeners.forEach(listener => listener(user as User));
  return { user } as UserCredential;
};

export const logoutUser = async () => {
  if (auth) {
    return await signOut(auth);
  }
  // Mock Logic
  console.log("[Demo] Logging out...");
  mockAuthListeners.forEach(listener => listener(null));
};

export const updateUserProfile = async (user: User, data: { displayName?: string, photoURL?: string }) => {
  if (auth) {
    return await updateProfile(user, data);
  }
  // Mock Logic
  console.log("[Demo] Updating profile:", data);
  // In a real app, we can't easily mutate the mockUser globally without side effects, 
  // but for demo purposes this log is sufficient.
  Object.assign(user, data);
  return;
};

export const sendUserVerification = async (user: User) => {
  if (auth) {
    return await sendEmailVerification(user);
  }
  console.log("[Demo] Sending verification email to:", user.email);
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  if (auth) {
    return onAuthStateChanged(auth, callback);
  }
  // Mock Logic
  mockAuthListeners.push(callback);
  // Trigger immediately with current mock state (usually null initially for demo)
  callback(null); 
  return () => {
    const idx = mockAuthListeners.indexOf(callback);
    if (idx > -1) mockAuthListeners.splice(idx, 1);
  };
};

// --- Firestore API ---

export const saveHistory = async (
  userId: string, 
  toolId: string, 
  input: string, 
  output: string, 
  type: 'text' | 'image' | 'video' = 'text'
) => {
  if (db) {
    try {
      await addDoc(collection(db, 'users', userId, 'history'), {
        toolId,
        input,
        output,
        type,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Error saving history:", e);
    }
  } else {
    console.log(`[Demo] Saving history for user ${userId}:`, { toolId, input, output, type });
  }
};