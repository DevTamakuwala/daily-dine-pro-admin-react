// src/components/LoginCard.js

import React, { useState } from 'react';
import { login as apiLogin, saveToken } from '../services/auth';
import api from '../services/apiClient';
import { encryptPassword } from '../services/encryptPassword';


const EyeIcon = () => (
  <>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    ></path>
  </>
);

const EyeOffIcon = () => (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
  ></path>
);

const SpinnerIcon = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const LoginCard = ({ onShowForgotPassword, onLogin, config }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // Add error state
  const [error, setError] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    setSuccess(false);

    try {
        // Print the full URL that will be called for login (baseURL + path)
        try {
          const base = api.defaults && api.defaults.baseURL ? api.defaults.baseURL : '';
          const fullUrl = base ? new URL('/api/auth/login', base).toString() : '/api/auth/login';
          console.log('Login request URL:', fullUrl);
        } catch (urlErr) {
          // fallback safe log
          console.log('Login request path: /api/auth/login');
        }

        const encrypted = await encryptPassword(password);

        const data = await apiLogin(email, encrypted);

        console.log('Login response:', data);

      // If server returns a token, persist it
      if (data?.token) {
        saveToken(data.token);
      }
      setLoading(false);
      setSuccess(true);
      // Lift auth data to parent and redirect after a short delay
      setTimeout(() => onLogin(data), 800);
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);
      // axios error objects often have response.data.message
      const serverMessage = err?.response?.data?.message || err?.message;
      setError(serverMessage || 'Login failed. Please try again.');
    }
  };

  return (
    <div
      id="loginCard"
      className="login-card glass-effect rounded-2xl p-8 w-full max-w-md relative z-10"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
            ></path>
          </svg>
        </div>
        <h1 id="platform-title" className="text-3xl font-bold text-white mb-2">
          {config.platform_title}
        </h1>
        <p id="admin-subtitle" className="text-white text-opacity-80">
          {config.admin_subtitle}
        </p>
      </div>

      <form id="loginForm" className="space-y-6" onSubmit={handleSubmit} style={{ opacity: success ? 0.5 : 1 }}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="input-focus w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-300"
            placeholder="admin@dailydine.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              required
              className="input-focus w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-300"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              id="togglePassword"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-opacity-60 hover:text-opacity-100 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              <svg id="eyeIcon" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </svg>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-white bg-transparent border-white border-opacity-30 rounded focus:ring-white focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-white text-opacity-80">
              Remember me
            </span>
          </label>
          <button
            type="button"
            id="forgotPasswordLink"
            className="text-sm text-white text-opacity-80 hover:text-opacity-100 transition-colors"
            onClick={onShowForgotPassword}
          >
            Forgot password?
          </button>
        </div>
        
        {/* Error Message */}
        {error && (
            <div className="text-red-300 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          id="loginButton"
          className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <SpinnerIcon />
              Signing In...
            </>
          ) : (
            <>
              <span id="login-button-text">{config.login_button_text}</span>
              <svg
                className="inline-block w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                ></path>
              </svg>
            </>
          )}
        </button>
      </form>

      {/* Success Message */}
      {success && (
        <div
          id="successMessage"
          className="mt-6 p-4 bg-green-500 bg-opacity-20 border border-green-400 border-opacity-30 rounded-lg"
        >
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span className="text-green-400 text-sm">
              Login successful! Redirecting to dashboard...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginCard;