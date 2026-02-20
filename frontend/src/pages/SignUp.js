// src/pages/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // Call backend API
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      });

      const data = await response.json();

      if (data.success) {
        alert('User created! Please verify your email from the client.');
        localStorage.setItem("signupEmail", email);
        navigate('/verify-email');
 // go to verify email page
      } else {
        alert(data.error);
      }

    } catch (error) {
      alert("Signup failed: " + error.message);
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
            Create Your Account
          </h2>

          <div className="flex flex-col gap-6">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="p-4 rounded-lg bg-[#0f172a] border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
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
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="p-4 rounded-lg bg-[#0f172a] border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 transition-all py-3 rounded-lg font-semibold text-lg"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>

          <p className="text-gray-400 mt-6 text-center">
            Already have an account?{' '}
            <span className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => navigate('/signin')}>
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
