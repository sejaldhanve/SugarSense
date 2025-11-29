import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Calendar, Clock, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
// 1. IMPORT NECESSARY TOOLS: Firebase, Firestore operations, and Axios for API calls
import { auth, db } from "../lib/firebase"; // Assumes correct path
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import axios from "axios";

// Define the expected structure of the user profile document (matching the Profile.tsx save format)
interface UserProfile {
  phone: string; // The field name used by Profile.tsx
  // targetGlucoseMax is NOT present in Firestore yet, so we don't define it here, but we will use a default value below.
}

const LogBloodSugar: React.FC = () => {
  const navigate = useNavigate();
  const [glucoseValue, setGlucoseValue] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Define the Agent API Endpoint URL
  const AGENT_API_URL = "http://localhost:5000/api/check_sugar_alert";

  // Default Max Target (Since Profile.tsx doesn't save it yet)
  const DEFAULT_TARGET_MAX = 180;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const user = auth.currentUser;
    const glucoseReading = parseFloat(glucoseValue);

    if (!user || isNaN(glucoseReading)) {
      console.error(
        "Authentication Error: User not logged in or glucose value invalid."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      // --- STEP A: SAVE DATA TO FIRESTORE ---
      const logData = {
        userId: user.uid,
        glucose: glucoseReading,
        date: date,
        time: time,
        timestamp: new Date(`${date}T${time}`).getTime(),
        notes: notes,
        createdAt: serverTimestamp(),
      };

      // Save the blood sugar log to the 'blood_sugar_logs' collection
      await addDoc(collection(db, "blood_sugar_logs"), logData);

      console.log("--- Log saved successfully! ---");

      // --- STEP B: FETCH CONTEXT FOR AGENT ---
      // CRITICAL FIX: Read from the 'users' collection (where Profile.tsx saves the data)
      const profileSnap = await getDoc(doc(db, "users", user.uid));
      const patientProfile = profileSnap.data() as UserProfile | undefined;

      // Check if the critical field ('phone') exists
      if (patientProfile && patientProfile.phone) {
        // 3. CONSTRUCT THE PAYLOAD FOR THE PYTHON AGENT API
        const triggerPayload = {
          current_sugar: glucoseReading,
          // CRITICAL FIX: Use the field name 'phone' from the Firestore document
          recipient_number: patientProfile.phone,
          // FIX: Use the hardcoded default target max
          user_target_max: DEFAULT_TARGET_MAX,

          // Sending static placeholders for now
          time_since_meal: "less than 2 hours",
          last_meal_carbs: "high-carb dessert (placeholder)",
          recent_activity: "0 minutes (placeholder)",
        };

        // 4. CALL THE SECURE BACKEND AGENT SERVICE
        const agentResponse = await axios.post(AGENT_API_URL, triggerPayload);

        console.log("Agent Check initiated. Response:", agentResponse.data);
      } else {
        // The error message is now accurate, telling the user to complete their profile
        console.warn(
          "Agent Check SKIPPED. Please set your phone number in the Profile page."
        );
      }
    } catch (error) {
      console.error("Fatal Error during log submission or Agent call:", error);
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
          Log Blood Sugar
        </h1>
        <p className="text-body-lg theme-text-secondary">
          Record your current glucose level for accurate tracking
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="theme-bg-card rounded-2xl p-8 theme-border border"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-500/10 rounded-xl">
            <Activity className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-section-title theme-text-primary">
              Blood Glucose Reading
            </h2>
            <p className="text-body theme-text-muted">
              Enter your current measurement
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Glucose Value */}
          <div>
            <label className="block text-label theme-text-secondary mb-2">
              Glucose Level (mg/dL) *
            </label>
            <input
              type="number"
              value={glucoseValue}
              onChange={(e) => setGlucoseValue(e.target.value)}
              required
              min="0"
              max="600"
              className="w-full px-4 py-3 theme-bg-card theme-border border rounded-xl theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter glucose value"
            />
          </div>

          {/* Date and Time (Existing JSX) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-label theme-text-secondary mb-2">
                Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 theme-text-muted" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 theme-bg-card theme-border border rounded-xl theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-label theme-text-secondary mb-2">
                Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 theme-text-muted" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 theme-bg-card theme-border border rounded-xl theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Notes (Existing JSX) */}
          <div>
            <label className="block text-label theme-text-secondary mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 theme-bg-card theme-border border rounded-xl theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Add any relevant notes (e.g., before meal, after exercise)"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-2 
                                ${
                                  isSubmitting
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-600"
                                } 
                                text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? "Saving..." : "Save Reading"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 theme-bg-card theme-border border rounded-xl theme-text-secondary hover:theme-text-primary font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LogBloodSugar;
