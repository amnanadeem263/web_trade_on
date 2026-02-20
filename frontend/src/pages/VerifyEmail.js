// src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { auth} from '../firebase'; // auth from Firebase client SDK
import { useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  // Auto-check if user verified email every 2 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        await user.reload(); // refresh user data
        if (user.emailVerified) {
          clearInterval(interval);
          alert("Email verified successfully!");
          navigate('/dashboard'); // redirect to dashboard
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [navigate]);

  // Resend verification email
const handleResendEmail = async () => {
  try {
    const email = localStorage.getItem("signupEmail");

    const response = await fetch('http://localhost:5000/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (data.success) {
      alert("Verification link generated. Check backend console.");
      console.log("Verification Link:", data.link);
      setEmailSent(true);
    } else {
      alert(data.error);
    }

  } catch (error) {
    alert(error.message);
  }
};


  return (
    <div className="bg-animated min-h-screen text-white flex justify-center items-center">
      <div className="bg-[#121826] p-10 rounded-2xl shadow-xl border border-gray-800 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-blue-500 mb-6">Verify Your Email</h2>
        <p className="mb-4">
          A verification email has been sent to your inbox. Please check your email and click the verification link.
        </p>
        <button
          onClick={handleResendEmail}
          className="bg-yellow-500 hover:bg-yellow-400 transition-all py-3 px-6 rounded-lg font-semibold mb-4"
        >
          Resend Verification Email
        </button>
        {emailSent && <p className="text-green-400 mb-2">Verification email resent!</p>}
        <p className="mt-6 text-gray-400">
          You will be redirected to dashboard automatically after verification.
        </p>
      </div>
    </div>
  );
}
