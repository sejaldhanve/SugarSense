import React, { useState } from 'react';
import { User, Lock } from 'lucide-react'; // Icons for better UX
import { auth } from './firebase'; // Firebase configuration
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, } from 'firebase/auth';

const LoginForm: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [isNewUser, setIsNewUser] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isNewUser) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin(); // Call the parent onLogin function on success
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setResetMessage('');
    if (!email) {
      setError('Please enter your email to reset the password.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage('Password reset email sent. Please check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-white">
          {isNewUser ? 'Create Account' : 'Sign In'}
        </h2>
        <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <div className="mt-1 flex items-center border border-gray-700 rounded-lg bg-gray-900 px-3">
              <User className="text-gray-400" size={20} />
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#29524A] border-none py-2 px-3"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="mt-1 flex items-center border border-gray-700 rounded-lg bg-gray-900 px-3">
              <Lock className="text-gray-400" size={20} />
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#29524A] border-none py-2 px-3"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Reset Message */}
          {resetMessage && <p className="text-green-500 text-sm">{resetMessage}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 text-sm font-medium rounded-lg ${
              loading
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-[#29524A] hover:bg-[#1f3d37]'
            } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#29524A]`}
          >
            {loading ? 'Processing...' : isNewUser ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Forgot Password */}
        {!isNewUser && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm font-medium text-[#29524A] hover:text-[#1f3d37] focus:outline-none"
            >
              Forgot Password?
            </button>
          </div>
        )}

        {/* Toggle Sign-Up / Sign-In */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsNewUser(!isNewUser)}
            className="text-sm font-medium text-[#29524A] hover:text-[#1f3d37] focus:outline-none"
          >
            {isNewUser
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
