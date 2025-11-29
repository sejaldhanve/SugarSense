import React, { useState } from "react";
import { motion } from "framer-motion";
import { Pill, Save, ArrowLeft, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
// 1. IMPORT NECESSARY TOOLS: Firebase, Firestore, and Axios
import { auth, db } from "../lib/firebase"; // Assumes correct path
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import axios from "axios";

// Define the structure of the user profile needed for the recipient phone number
interface UserProfile {
  phone: string; // Must match the 'phone' field saved by Profile.tsx
}

const AddMedication: React.FC = () => {
  const navigate = useNavigate();
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("once-daily");
  const [schedule, setSchedule] = useState(""); // Stores HH:MM time string
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission

  // 2. Define the NEW Agent API Endpoint URL for scheduling
  const SCHEDULE_API_URL = "http://localhost:5000/api/schedule_reminder";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const user = auth.currentUser;
    if (!user) {
      console.error("Authentication Error: User not logged in.");
      setIsSubmitting(false);
      return;
    }

    try {
      // --- STEP A: SAVE MEDICATION LOG TO FIRESTORE (for records) ---
      const logData = {
        userId: user.uid,
        medicationName: medicationName,
        dosage: dosage,
        frequency: frequency,
        scheduleTime: schedule, // Time (HH:MM)
        notes: notes,
        createdAt: serverTimestamp(),
      };

      // Save the medication log to a 'medication_logs' collection
      await addDoc(collection(db, "medication_logs"), logData);

      console.log("--- Medication saved successfully! ---");

      // --- STEP B: FETCH RECIPIENT PHONE NUMBER ---
      // CRITICAL FIX: Read from the 'users' collection (where Profile.tsx saves phone)
      const profileSnap = await getDoc(doc(db, "users", user.uid));
      const patientProfile = profileSnap.data() as UserProfile | undefined;

      if (patientProfile && patientProfile.phone) {
        // 3. CONSTRUCT THE PAYLOAD FOR THE SCHEDULING API
        const triggerPayload = {
          recipient_number: patientProfile.phone, // Phone number for the SMS
          medication_name: medicationName,
          dosage: dosage,
          // The time string (HH:MM) the Python server needs for scheduling
          scheduled_time: schedule,
        };

        // 4. CALL THE SECURE BACKEND SCHEDULER SERVICE
        const response = await axios.post(SCHEDULE_API_URL, triggerPayload);

        console.log("Medication Reminder Scheduled. Response:", response.data);
      } else {
        console.warn(
          "Phone number missing from user profile. Medication saved, but reminder NOT scheduled."
        );
      }
    } catch (error) {
      console.error("Fatal Error during log submission or Agent call:", error);
      // In a real app, you might only show an error if the Firestore save failed, not the reminder API call.
    } finally {
      setIsSubmitting(false);
      // Navigate back to dashboard once all server operations are complete
      navigate("/dashboard");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 theme-text-secondary hover:theme-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <h1 className="text-title-lg theme-text-primary mb-2">
          Add Medication
        </h1>
        <p className="text-body-lg theme-text-secondary">
          Set up a new medication reminder for your treatment plan
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="theme-bg-card rounded-2xl p-8 theme-border border"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-500/10 rounded-xl">
            <Pill className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h2 className="text-section-title theme-text-primary">
              Medication Details
            </h2>
            <p className="text-body theme-text-muted">
              Enter your medication information
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Medication Name */}
          <div>
            <label className="block text-label theme-text-secondary mb-2">
              Medication Name *
            </label>
            <input
              type="text"
              value={medicationName}
              onChange={(e) => setMedicationName(e.target.value)}
              required
              className="w-full px-4 py-3 theme-bg-card theme-border border rounded-xl theme-text-primary focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Metformin"
            />
          </div>

          {/* Dosage */}
          <div>
            <label className="block text-label theme-text-secondary mb-2">
              Dosage *
            </label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              required
              className="w-full px-4 py-3 theme-bg-card theme-border border rounded-xl theme-text-primary focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 500mg"
            />
          </div>

          {/* Frequency & Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-label theme-text-secondary mb-2">
                Frequency *
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                required
                className="w-full px-4 py-3 theme-bg-card theme-border border rounded-xl theme-text-primary focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="once-daily">Once Daily</option>
                <option value="twice-daily">Twice Daily</option>
                <option value="three-times">Three Times Daily</option>
                <option value="as-needed">As Needed</option>
              </select>
            </div>
            <div>
              <label className="block text-label theme-text-secondary mb-2">
                Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 theme-text-muted" />
                <input
                  type="time"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 theme-bg-card theme-border border rounded-xl theme-text-primary focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-label theme-text-secondary mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 theme-bg-card theme-border border rounded-xl theme-text-primary focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="Add any special instructions or notes"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting} // Disable while submitting
              className={`flex-1 flex items-center justify-center gap-2 
                                ${
                                  isSubmitting
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-green-500 hover:bg-green-600"
                                } 
                                text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500`}
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? "Scheduling..." : "Save Medication"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 theme-bg-card theme-border border rounded-xl theme-text-secondary hover:theme-text-primary font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddMedication;
