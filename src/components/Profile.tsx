import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Save, Edit3, Mail, Phone, Calendar, Weight, Activity } from 'lucide-react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  bloodGlucose: number;
  hba1c: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  profilePhoto?: string;
  updatedAt: Date;
}

const Profile: React.FC = () => {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: user?.email || '',
    phone: '',
    age: 0,
    gender: '',
    weight: 0,
    height: 0,
    bloodGlucose: 0,
    hba1c: 0,
    bloodPressure: { systolic: 0, diastolic: 0 },
    updatedAt: new Date()
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!user) return;

    const profileRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(profileRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setProfile({
          ...data,
          bloodPressure: data.bloodPressure || { systolic: 0, diastolic: 0 },
          email: user.email || '',
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as UserProfile);
      } else {
        // Initialize with user email
        setProfile(prev => ({
          ...prev,
          email: user.email || ''
        }));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!profile.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!profile.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(profile.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (profile.age <= 0 || profile.age > 120) {
      newErrors.age = 'Please enter a valid age (1-120)';
    }

    if (profile.weight <= 0 || profile.weight > 500) {
      newErrors.weight = 'Please enter a valid weight (1-500 kg)';
    }

    if (profile.height <= 0 || profile.height > 300) {
      newErrors.height = 'Please enter a valid height (1-300 cm)';
    }

    if (profile.bloodGlucose < 0 || profile.bloodGlucose > 600) {
      newErrors.bloodGlucose = 'Please enter a valid blood glucose level (0-600 mg/dL)';
    }

    if (profile.hba1c < 0 || profile.hba1c > 20) {
      newErrors.hba1c = 'Please enter a valid HbA1c level (0-20%)';
    }

    if (profile.bloodPressure.systolic < 50 || profile.bloodPressure.systolic > 300) {
      newErrors.systolic = 'Please enter a valid systolic pressure (50-300 mmHg)';
    }

    if (profile.bloodPressure.diastolic < 30 || profile.bloodPressure.diastolic > 200) {
      newErrors.diastolic = 'Please enter a valid diastolic pressure (30-200 mmHg)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof UserProfile] as any),
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploadingPhoto(true);
    try {
      const photoRef = ref(storage, `profile-photos/${user.uid}`);
      await uploadBytes(photoRef, file);
      const photoURL = await getDownloadURL(photoRef);
      
      setProfile(prev => ({ ...prev, profilePhoto: photoURL }));
      
      // Save to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        ...profile,
        profilePhoto: photoURL,
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!validateForm() || !user) return;

    setSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...profile,
        updatedAt: new Date()
      }, { merge: true });
      
      setIsEditing(false);
      // Clear any errors on successful save
      setErrors({});
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ submit: 'Failed to save profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    // Reset form to original values if needed
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
            <p className="text-slate-300">Manage your personal information and health data</p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (isEditing) {
                handleCancel();
              } else {
                setIsEditing(true);
              }
            }}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Photo & Basic Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
        >
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
                {profile.profilePhoto ? (
                  <img
                    src={profile.profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-slate-400" />
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full cursor-pointer transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploadingPhoto}
                    onClick={(e) => e.stopPropagation()}
                  />
                </label>
              )}
              {uploadingPhoto && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-semibold text-white mb-2">
              {profile.name || 'Your Name'}
            </h2>
            <p className="text-slate-300 mb-4">{profile.email}</p>
            
            {profile.updatedAt && (
              <p className="text-xs text-slate-400">
                Last updated: {profile.updatedAt.toLocaleDateString()}
              </p>
            )}
          </div>
        </motion.div>

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Basic Info */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                      errors.name ? 'border-red-400' : 'border-white/20'
                    }`}
                    placeholder="Enter your full name"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                  />
                ) : (
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className={!profile.name ? "text-gray-500" : ""}>{profile.name || 'Not set'}</span>
                  </div>
                )}
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-700/50 border border-white/20 rounded-xl text-slate-400">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                  <span className="text-xs">(Read-only)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                      errors.phone ? 'border-red-400' : 'border-white/20'
                    }`}
                    placeholder="+91-9876543210"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                  />
                ) : (
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className={!profile.phone ? "text-gray-500" : ""}>{profile.phone || 'Add phone number'}</span>
                  </div>
                )}
                {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Age</label>
                {isEditing ? (
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={profile.age || ''}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                      errors.age ? 'border-red-400' : 'border-white/20'
                    }`}
                    placeholder="Your age"
                  />
                ) : (
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className={!profile.age ? "text-gray-500" : ""}>{profile.age ? `${profile.age} years` : 'Not set'}</span>
                  </div>
                )}
                {errors.age && <p className="mt-1 text-sm text-red-400">{errors.age}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Gender</label>
                {isEditing ? (
                  <select
                    value={profile.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <div className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white capitalize">
                    <span className={!profile.gender ? "text-gray-500" : ""}>{profile.gender || 'Not set'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Weight (kg)</label>
                {isEditing ? (
                  <input
                    type="number"
                    min="1"
                    max="500"
                    step="0.1"
                    value={profile.weight || ''}
                    onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                      errors.weight ? 'border-red-400' : 'border-white/20'
                    }`}
                    placeholder="Your weight"
                  />
                ) : (
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white">
                    <Weight className="w-4 h-4 text-slate-400" />
                    <span className={!profile.weight ? "text-gray-500" : ""}>{profile.weight ? `${profile.weight} kg` : 'Not set'}</span>
                  </div>
                )}
                {errors.weight && <p className="mt-1 text-sm text-red-400">{errors.weight}</p>}
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Health Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Blood Glucose (mg/dL)</label>
                {isEditing ? (
                  <input
                    type="number"
                    min="0"
                    max="600"
                    value={profile.bloodGlucose || ''}
                    onChange={(e) => handleInputChange('bloodGlucose', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                      errors.bloodGlucose ? 'border-red-400' : 'border-white/20'
                    }`}
                    placeholder="Current glucose level"
                  />
                ) : (
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white">
                    <Activity className="w-4 h-4 text-slate-400" />
                    <span className={!profile.bloodGlucose ? "text-gray-500" : ""}>{profile.bloodGlucose ? `${profile.bloodGlucose} mg/dL` : 'Not set'}</span>
                  </div>
                )}
                {errors.bloodGlucose && <p className="mt-1 text-sm text-red-400">{errors.bloodGlucose}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">HbA1c (%)</label>
                {isEditing ? (
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.1"
                    value={profile.hba1c || ''}
                    onChange={(e) => handleInputChange('hba1c', parseFloat(e.target.value) || 0)}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                      errors.hba1c ? 'border-red-400' : 'border-white/20'
                    }`}
                    placeholder="HbA1c level"
                  />
                ) : (
                  <div className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white">
                    <span className={!profile.hba1c ? "text-gray-500" : ""}>{profile.hba1c ? `${profile.hba1c}%` : 'Not set'}</span>
                  </div>
                )}
                {errors.hba1c && <p className="mt-1 text-sm text-red-400">{errors.hba1c}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Blood Pressure (mmHg)</label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="50"
                      max="300"
                      value={profile.bloodPressure.systolic || ''}
                      onChange={(e) => handleInputChange('bloodPressure.systolic', parseInt(e.target.value) || 0)}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                        errors.systolic ? 'border-red-400' : 'border-white/20'
                      }`}
                      placeholder="Systolic"
                    />
                    <input
                      type="number"
                      min="30"
                      max="200"
                      value={profile.bloodPressure.diastolic || ''}
                      onChange={(e) => handleInputChange('bloodPressure.diastolic', parseInt(e.target.value) || 0)}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                        errors.diastolic ? 'border-red-400' : 'border-white/20'
                      }`}
                      placeholder="Diastolic"
                    />
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white">
                    <span className={(!profile.bloodPressure.systolic || !profile.bloodPressure.diastolic) ? "text-gray-500" : ""}>
                      {profile.bloodPressure.systolic || 'Not set'} / {profile.bloodPressure.diastolic || 'Not set'}
                    </span>
                  </div>
                )}
                {(errors.systolic || errors.diastolic) && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.systolic || errors.diastolic}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Height (cm)</label>
                {isEditing ? (
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={profile.height || ''}
                    onChange={(e) => handleInputChange('height', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                      errors.height ? 'border-red-400' : 'border-white/20'
                    }`}
                    placeholder="Your height"
                  />
                ) : (
                  <div className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white">
                    <span className={!profile.height ? "text-gray-500" : ""}>{profile.height ? `${profile.height} cm` : 'Not set'}</span>
                  </div>
                )}
                {errors.height && <p className="mt-1 text-sm text-red-400">{errors.height}</p>}
              </div>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              {errors.submit && (
                <p className="text-red-400 text-sm mr-4 self-center">{errors.submit}</p>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                disabled={saving}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;