// src/pages/SignIn.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSignIn = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        // Save custom token to localStorage or state
        localStorage.setItem('token', data.token);
        alert('Signed in successfully!');
        navigate('/dashboard');
      } else {
        alert(data.error);
      }

    } catch (error) {
      alert("Sign in failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-animated min-h-screen text-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center items-center px-4">
        <div className="bg-[#121826] p-10 rounded-2xl shadow-xl border border-gray-800 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-500">
            Sign In to TradeOn
          </h2>

          <div className="flex flex-col gap-6 mb-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="p-4 rounded-lg bg-[#0f172a] border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="p-4 rounded-lg bg-[#0f172a] border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              onClick={handleEmailSignIn}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 transition-all py-3 rounded-lg font-semibold text-lg"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <p className="text-gray-400 mt-6 text-center">
            Don’t have an account?{' '}
            <span className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => navigate('/signup')}>
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
