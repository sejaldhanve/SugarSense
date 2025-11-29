import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Heart, Pill, Target, Phone, Save, Mail } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface PatientIntakeFormProps {
  onComplete: () => void;
}

const PatientIntakeForm: React.FC<PatientIntakeFormProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    email: auth.currentUser?.email || '',
    phone: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    
    // Medical History
    diabetesType: '',
    diagnosisYear: '',
    currentMedications: '',
    hba1c: '',
    lastHbA1cDate: '',
    fastingGlucose: '',
    postMealGlucose: '',
    targetGlucose: { min: '', max: '' },
    bloodPressure: { systolic: '', diastolic: '' },
    cholesterol: '',
    
    // Health Information
    allergies: '',
    complications: '',
    familyHistory: '',
    
    // Lifestyle
    dietaryRestrictions: '',
    exerciseLevel: '',
    exerciseFrequency: '',
    smokingStatus: '',
    alcoholConsumption: '',
    sleepHours: '',
    stressLevel: '',
    
    // Goals and Preferences
    healthGoals: '',
    cuisinePreferences: '',
    budgetRange: '',
    preferredMealTimes: {
      breakfast: '',
      lunch: '',
      dinner: ''
    },
    
    // Emergency Contact
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
      email: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const steps = [
    { title: 'Personal Information', icon: User },
    { title: 'Health Records', icon: Heart },
    { title: 'Medical Details', icon: Pill },
    { title: 'Lifestyle & Preferences', icon: Target },
    { title: 'Emergency Contact', icon: Phone }
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Save to Firestore
      await setDoc(doc(db, 'patient_profiles', user.uid), {
          userId: user.uid,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          age: parseInt(formData.age),
          gender: formData.gender,
          height: formData.height ? parseFloat(formData.height) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          diabetes_type: formData.diabetesType,
          diagnosis_year: parseInt(formData.diagnosisYear),
          current_medications: formData.currentMedications,
          hba1c: formData.hba1c ? parseFloat(formData.hba1c) : null,
          last_hba1c_date: formData.lastHbA1cDate,
          fasting_glucose: formData.fastingGlucose ? parseInt(formData.fastingGlucose) : null,
          post_meal_glucose: formData.postMealGlucose ? parseInt(formData.postMealGlucose) : null,
          target_glucose_min: formData.targetGlucose.min ? parseInt(formData.targetGlucose.min) : null,
          target_glucose_max: formData.targetGlucose.max ? parseInt(formData.targetGlucose.max) : null,
          blood_pressure_systolic: formData.bloodPressure.systolic ? parseInt(formData.bloodPressure.systolic) : null,
          blood_pressure_diastolic: formData.bloodPressure.diastolic ? parseInt(formData.bloodPressure.diastolic) : null,
          cholesterol: formData.cholesterol ? parseInt(formData.cholesterol) : null,
          allergies: formData.allergies,
          complications: formData.complications,
          family_history: formData.familyHistory,
          dietary_restrictions: formData.dietaryRestrictions,
          exercise_level: formData.exerciseLevel,
          exercise_frequency: formData.exerciseFrequency,
          smoking_status: formData.smokingStatus,
          alcohol_consumption: formData.alcoholConsumption,
          sleep_hours: formData.sleepHours ? parseFloat(formData.sleepHours) : null,
          stress_level: formData.stressLevel,
          health_goals: formData.healthGoals,
          cuisine_preferences: formData.cuisinePreferences,
          budget_range: formData.budgetRange,
          emergency_contact_name: formData.emergencyContact.name,
          emergency_contact_phone: formData.emergencyContact.phone,
          emergency_contact_relationship: formData.emergencyContact.relationship,
          emergencyContactEmail: formData.emergencyContact.email,
          createdAt: new Date(),
          updatedAt: new Date()
        });

      onComplete();
    } catch (error) {
      console.error('Error saving patient data:', error);
      setSubmitError('Failed to save your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  defaultValue={auth.currentUser?.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="+91-9876543210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Age *</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  required
                  min="1"
                  max="120"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Your age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Height (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  min="50"
                  max="250"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Height in cm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  min="20"
                  max="300"
                  step="0.1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Weight in kg"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Health Records</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Diabetes Type *</label>
                <select
                  value={formData.diabetesType}
                  onChange={(e) => handleInputChange('diabetesType', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="">Select type</option>
                  <option value="1">Type 1</option>
                  <option value="2">Type 2</option>
                  <option value="gestational">Gestational</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Year of Diagnosis *</label>
                <input
                  type="number"
                  value={formData.diagnosisYear}
                  onChange={(e) => handleInputChange('diagnosisYear', e.target.value)}
                  required
                  min="1950"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="e.g., 2020"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Latest HbA1c (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="4"
                  max="15"
                  value={formData.hba1c}
                  onChange={(e) => handleInputChange('hba1c', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="e.g., 7.2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Last HbA1c Test Date</label>
                <input
                  type="date"
                  value={formData.lastHbA1cDate}
                  onChange={(e) => handleInputChange('lastHbA1cDate', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Fasting Glucose (mg/dL)</label>
                <input
                  type="number"
                  min="50"
                  max="400"
                  value={formData.fastingGlucose}
                  onChange={(e) => handleInputChange('fastingGlucose', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="e.g., 95"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Post-Meal Glucose (mg/dL)</label>
                <input
                  type="number"
                  min="50"
                  max="400"
                  value={formData.postMealGlucose}
                  onChange={(e) => handleInputChange('postMealGlucose', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="e.g., 140"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Target Glucose Range (mg/dL)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="50"
                    max="200"
                    value={formData.targetGlucose.min}
                    onChange={(e) => handleInputChange('targetGlucose.min', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Min (e.g., 80)"
                  />
                  <input
                    type="number"
                    min="50"
                    max="200"
                    value={formData.targetGlucose.max}
                    onChange={(e) => handleInputChange('targetGlucose.max', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Max (e.g., 130)"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Medical Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Current Medications</label>
                <textarea
                  value={formData.currentMedications}
                  onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="e.g., Metformin 500mg twice daily, Insulin as needed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Allergies</label>
                <textarea
                  value={formData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="e.g., Peanuts, Shellfish, Penicillin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Blood Pressure (mmHg)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="60"
                    max="250"
                    value={formData.bloodPressure.systolic}
                    onChange={(e) => handleInputChange('bloodPressure.systolic', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Systolic (120)"
                  />
                  <input
                    type="number"
                    min="40"
                    max="150"
                    value={formData.bloodPressure.diastolic}
                    onChange={(e) => handleInputChange('bloodPressure.diastolic', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Diastolic (80)"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Cholesterol (mg/dL)</label>
                <input
                  type="number"
                  min="100"
                  max="400"
                  value={formData.cholesterol}
                  onChange={(e) => handleInputChange('cholesterol', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="e.g., 180"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Diabetes Complications</label>
                <textarea
                  value={formData.complications}
                  onChange={(e) => handleInputChange('complications', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="e.g., Neuropathy, Retinopathy, None"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Family History of Diabetes</label>
                <textarea
                  value={formData.familyHistory}
                  onChange={(e) => handleInputChange('familyHistory', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="e.g., Mother has Type 2 diabetes, Father has hypertension"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Lifestyle & Preferences</h3>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Dietary Restrictions</label>
              <textarea
                value={formData.dietaryRestrictions}
                onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="e.g., Vegetarian, No gluten, Low sodium"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Exercise Level</label>
                <select
                  value={formData.exerciseLevel}
                  onChange={(e) => handleInputChange('exerciseLevel', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="">Select level</option>
                  <option value="sedentary">Sedentary (little to no exercise)</option>
                  <option value="light">Light activity (1-3 days/week)</option>
                  <option value="moderate">Moderate activity (3-5 days/week)</option>
                  <option value="active">Very active (6-7 days/week)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Exercise Frequency</label>
                <input
                  type="text"
                  value={formData.exerciseFrequency}
                  onChange={(e) => handleInputChange('exerciseFrequency', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="e.g., 30 minutes walking daily"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Smoking Status</label>
                <select
                  value={formData.smokingStatus}
                  onChange={(e) => handleInputChange('smokingStatus', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="">Select status</option>
                  <option value="never">Never smoked</option>
                  <option value="former">Former smoker</option>
                  <option value="current">Current smoker</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Alcohol Consumption</label>
                <select
                  value={formData.alcoholConsumption}
                  onChange={(e) => handleInputChange('alcoholConsumption', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="">Select frequency</option>
                  <option value="never">Never</option>
                  <option value="rarely">Rarely (special occasions)</option>
                  <option value="moderate">Moderate (1-2 drinks/week)</option>
                  <option value="regular">Regular (3+ drinks/week)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Sleep Hours (per night)</label>
                <input
                  type="number"
                  min="3"
                  max="12"
                  step="0.5"
                  value={formData.sleepHours}
                  onChange={(e) => handleInputChange('sleepHours', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="e.g., 7.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Stress Level</label>
                <select
                  value={formData.stressLevel}
                  onChange={(e) => handleInputChange('stressLevel', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="">Select level</option>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Health Goals</label>
              <textarea
                value={formData.healthGoals}
                onChange={(e) => handleInputChange('healthGoals', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="e.g., Lower HbA1c to below 7%, Lose 5kg, Exercise regularly"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Cuisine Preferences</label>
              <input
                type="text"
                value={formData.cuisinePreferences}
                onChange={(e) => handleInputChange('cuisinePreferences', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="e.g., North Indian, South Indian, Continental"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Monthly Budget for Health Products (₹)</label>
              <select
                value={formData.budgetRange}
                onChange={(e) => handleInputChange('budgetRange', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="">Select range</option>
                <option value="1000-3000">₹1,000 - ₹3,000</option>
                <option value="3000-5000">₹3,000 - ₹5,000</option>
                <option value="5000-10000">₹5,000 - ₹10,000</option>
                <option value="10000+">₹10,000+</option>
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Contact Name *</label>
                <input
                  type="text"
                  value={formData.emergencyContact.name}
                  onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Emergency contact name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="+91-9876543210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Relationship *</label>
                <input
                  type="text"
                  value={formData.emergencyContact.relationship}
                  onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="e.g., Spouse, Parent, Doctor, Sibling"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.emergencyContact.email}
                  onChange={(e) => handleInputChange('emergencyContact.email', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="contact@example.com"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className={`flex flex-col items-center ${
                    index <= currentStep ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      index <= currentStep
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-center hidden md:block">{step.title}</span>
                </div>
              );
            })}
          </div>

          {/* Form Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>

          {submitError && (
            <div className="text-red-400 text-sm text-center mb-4" role="alert">
              {submitError}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-slate-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
            >
              Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
              >
                <Save className="w-5 h-5" />
                {isSubmitting ? 'Saving...' : 'Complete Setup'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientIntakeForm;