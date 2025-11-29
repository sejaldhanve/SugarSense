import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Configure providers
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

facebookProvider.setCustomParameters({
  display: 'popup'
});

export default app;

// Database Types
export interface PatientProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  height?: number;
  weight?: number;
  diabetesType: string;
  diagnosisYear: number;
  currentMedications?: string;
  hba1c?: number;
  lastHbA1cDate?: string;
  fastingGlucose?: number;
  postMealGlucose?: number;
  targetGlucoseMin?: number;
  targetGlucoseMax?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  cholesterol?: number;
  allergies?: string;
  complications?: string;
  familyHistory?: string;
  dietaryRestrictions?: string;
  exerciseLevel?: string;
  exerciseFrequency?: string;
  smokingStatus?: string;
  alcoholConsumption?: string;
  sleepHours?: number;
  stressLevel?: string;
  healthGoals?: string;
  cuisinePreferences?: string;
  budgetRange?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  emergencyContactEmail?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  glycemicIndex: number;
  carbs: number;
  fiber: number;
  protein: number;
  fat?: number;
  calories?: number;
  allergens: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  createdAt?: Date;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt?: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: any[];
  total: number;
  status: string;
  shippingAddress: any;
  createdAt?: Date;
}