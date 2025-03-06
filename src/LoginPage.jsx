import React, { useState, useEffect } from 'react';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useTheme, ThemeToggle } from './ThemeProvider';

const LoginPage = ({ onSignupClick, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [countdown, setCountdown] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    let countdownInterval;
    if (countdown !== null && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdownInterval);
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0) {
      checkUserProfile();
    }
  }, [countdown]);

  const checkUserProfile = async () => {
    const userId = localStorage.getItem('user_id');
    try {
      const response = await fetch(`https://backend-ai-cloud-explains.onrender.com/get_user_profile?user_id=${userId}`);
      
      const data = await response.json();

      // Dispatch login event first
      window.dispatchEvent(new Event('user-login'));

      if (response.ok && data.preferences) {
        // Profile exists, go to home page
        onLoginSuccess(userId, false);
      } else {
        // No profile or error, redirect to profile page
        onLoginSuccess(userId, true);
      }
    } catch (err) {
      console.error('Error checking user profile:', err);
      // In case of error, go to home page as fallback
      window.dispatchEvent(new Event('user-login'));
      onLoginSuccess(userId, false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://backend-ai-cloud-explains.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user_id) {
        localStorage.setItem('user_id', data.user_id.toString());
        localStorage.setItem('user_email', email);
        setMessage({ 
          type: 'success', 
          text: 'Logged in successfully! Redirecting in 3s'
        });
        setCountdown(3);
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Invalid credentials'
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage({ 
        type: 'error', 
        text: 'Server error. Please try again later.'
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-terminal-white dark:bg-cyber-black transition-colors duration-300">
      {/* Theme Toggle Button */}
      <div className="absolute top-6 left-6 z-10">
        <ThemeToggle />
      </div>
      
      <div className="relative flex flex-col items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-md">
          <div className="cyber-card p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-terminal-white">Welcome Back</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to continue your learning journey</p>
            </div>

            {message.text && (
              <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${
                message.type === 'success' 
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
              }`}>
                {message.text}
                {countdown && message.type === 'success' && (
                  <span className="ml-1">({countdown})</span>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-terminal-silver mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    className="cyber-input w-full pl-10 pr-4 py-3"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail className="w-5 h-5 text-[#3A3A3A] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-terminal-silver mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    className="cyber-input w-full pl-10 pr-4 py-3"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock className="w-5 h-5 text-[#3A3A3A] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                className="cyber-button w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-neon-teal dark:text-cyber-black text-white py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-neon-blue transition-colors duration-200"
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <a href="#" className="text-sm text-neon-blue dark:text-neon-teal hover:underline block">
                Forgot your password?
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button
                  onClick={onSignupClick}
                  className="text-neon-blue dark:text-neon-teal hover:underline font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;