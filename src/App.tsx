import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import PatientIntakeForm from './components/PatientIntakeForm';
import Dashboard from './components/Dashboard';
import Store from './components/Store';
import ProductDetail from './components/ProductDetail';
import Orders from './components/Orders';
import Profile from './components/Profile';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AICoach from './components/AICoach';
import ChatBot from './components/ChatBot';
import Layout from './components/Layout';
import LogBloodSugar from './components/LogBloodSugar';
import AIChat from './components/AIChat';
import ChatpataAI from './components/ChatpataAI';
import AddMedication from './components/AddMedication';
import ViewReports from './components/ViewReports';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { AIProvider } from './context/AIContext';
import { ThemeProvider } from './context/ThemeContext';

const AppContent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedIntake, setHasCompletedIntake] = useState(false);

  useEffect(() => {
    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        checkIntakeCompletion(user.uid);
      } else {
        setHasCompletedIntake(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const checkIntakeCompletion = async (userId: string) => {
    try {
      const docRef = doc(db, 'patient_profiles', userId);
      const docSnap = await getDoc(docRef);

      setHasCompletedIntake(docSnap.exists());
    } catch (error) {
      console.error('Error checking intake completion:', error);
      setHasCompletedIntake(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        
        {/* Protected routes */}
        {user && !hasCompletedIntake && (
          <Route 
            path="/intake" 
            element={<PatientIntakeForm onComplete={() => setHasCompletedIntake(true)} />} 
          />
        )}
        
        {user && hasCompletedIntake && (
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/store" element={<Store />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/coach" element={<AICoach />} />
                <Route path="/log-blood-sugar" element={<LogBloodSugar />} />
                <Route path="/ai-chat" element={<AIChat />} />
                <Route path="/chatpata" element={<ChatpataAI />} />
                <Route path="/medications" element={<AddMedication />} />
                <Route path="/reports" element={<ViewReports />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
              <ChatBot />
            </Layout>
          } />
        )}
        
        {/* Redirect logic */}
        {user && !hasCompletedIntake && (
          <Route path="*" element={<Navigate to="/intake" />} />
        )}
        
        {!user && (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <CartProvider>
          <AIProvider>
            <Router>
              <AppContent />
            </Router>
          </AIProvider>
        </CartProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;