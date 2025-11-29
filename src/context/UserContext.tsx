import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  diabetesType: '1' | '2' | 'gestational';
  hba1c: number;
  targetGlucose: { min: number; max: number };
  medications: string[];
  dietaryRestrictions: string[];
  healthGoals: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface HealthData {
  glucose: { value: number; timestamp: Date; type: 'fasting' | 'postprandial' | 'random' }[];
  weight: { value: number; timestamp: Date }[];
  bloodPressure: { systolic: number; diastolic: number; timestamp: Date }[];
  medications: { name: string; dosage: string; timestamp: Date; taken: boolean }[];
}

interface UserContextType {
  user: User | null;
  userProfile: UserProfile | null;
  healthData: HealthData;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addHealthData: (type: keyof HealthData, data: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [healthData, setHealthData] = useState<HealthData>({
    glucose: [
      { value: 95, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), type: 'fasting' },
      { value: 140, timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), type: 'postprandial' },
      { value: 110, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), type: 'fasting' },
    ],
    weight: [
      { value: 70, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      { value: 69.8, timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000) },
    ],
    bloodPressure: [
      { systolic: 120, diastolic: 80, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    ],
    medications: [
      { name: 'Metformin', dosage: '500mg', timestamp: new Date(), taken: true },
      { name: 'Insulin', dosage: '10 units', timestamp: new Date(), taken: false },
    ]
  });

  useEffect(() => {
    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        loadUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const docRef = doc(db, 'patient_profiles', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserProfile({
          id: data.userId,
          name: data.name,
          email: data.email,
          age: data.age,
          diabetesType: data.diabetes_type as '1' | '2' | 'gestational',
          hba1c: data.hba1c,
          targetGlucose: { 
            min: data.targetGlucoseMin || 80, 
            max: data.targetGlucoseMax || 130 
          },
          medications: data.currentMedications ? data.currentMedications.split(',').map((m: string) => m.trim()) : [],
          dietaryRestrictions: data.dietaryRestrictions ? data.dietaryRestrictions.split(',').map((d: string) => d.trim()) : [],
          healthGoals: data.healthGoals ? data.healthGoals.split(',').map((g: string) => g.trim()) : [],
          emergencyContact: {
            name: data.emergencyContactName,
            phone: data.emergencyContactPhone,
            relationship: data.emergencyContactRelationship
          }
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, ...profile });
      // TODO: Save to Firestore
    }
  };

  const addHealthData = (type: keyof HealthData, data: any) => {
    setHealthData(prev => ({
      ...prev,
      [type]: [...prev[type], data]
    }));
    // Save to Firestore
  };

  return (
    <UserContext.Provider value={{
      user,
      userProfile,
      healthData,
      updateUserProfile,
      addHealthData
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};