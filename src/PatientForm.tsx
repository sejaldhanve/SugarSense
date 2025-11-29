import React, { useState } from 'react';
import { db } from './firebase'; // Ensure proper Firebase Firestore import
import { doc, setDoc } from 'firebase/firestore'; // Firestore functions
import { auth } from './firebase'; // Firebase Auth

const PatientForm: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    diabetesType: '',
    diagnosisYear: '',
    medication: '',
    hba1c: '',
    fastingSugar: '',
    weight: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("You must be logged in to submit this form.");
        return;
      }

      await setDoc(doc(db, "patients", user.uid), { ...formData, userId: user.uid });
      setSuccessMessage("Patient data saved successfully!");
      onSubmit(); // Call the parent function to handle navigation or updates
    } catch (err) {
      console.error("Error saving patient data:", err);
      setError("An error occurred while saving the data. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-lg w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-white mb-4">Patient Form</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Fields */}
          {[
            { label: "Full Name", name: "fullName", type: "text" },
            { label: "Age", name: "age", type: "number" },
            { label: "Gender", name: "gender", type: "select", options: ["Male", "Female", "Other"] },
            { label: "Diabetes Type", name: "diabetesType", type: "text" },
            { label: "Diagnosis Year", name: "diagnosisYear", type: "number" },
            { label: "Medication", name: "medication", type: "textarea" },
            { label: "HbA1c (%)", name: "hba1c", type: "number" },
            { label: "Fasting Sugar (mg/dL)", name: "fastingSugar", type: "number" },
            { label: "Weight (kg)", name: "weight", type: "number" },
          ].map((field, index) => (
            <div key={index}>
              <label className="block text-gray-300 text-sm mb-1">{field.label}</label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  onChange={handleChange}
                  value={(formData as any)[field.name]}
                  className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2"
                >
                  <option value="" disabled>Select {field.label}</option>
                  {field.options?.map((option, idx) => (
                    <option key={idx} value={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2"
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-[#29524A] text-white py-2 rounded-lg hover:bg-[#1f3d37]"
          >
            Save Information
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
