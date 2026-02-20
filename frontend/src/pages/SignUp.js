import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import { auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        createdAt: new Date()
      });

      await sendEmailVerification(user);

      alert("Verification email sent! Check your Gmail.");
      navigate("/verify-email");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= STYLES ================= */

  const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#0f172a,#0b0f1a)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px"
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(20,25,40,0.75)",
    backdropFilter: "blur(15px)",
    borderRadius: "16px",
    padding: "40px 30px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
    color: "#fff"
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "#111827",
    color: "#fff",
    marginBottom: "15px",
    fontSize: "14px"
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 600,
    fontSize: "15px",
    cursor: "pointer",
    transition: "0.3s"
  };

  const linkStyle = {
    color: "#3b82f6",
    cursor: "pointer",
    fontWeight: 500
  };

  return (
    <>
      <Navbar />

      <div style={pageStyle}>
        <div style={cardStyle}>
          <h2 style={{ marginBottom: 10 }}>Create Account</h2>
          <p style={{ color: "#9ca3af", marginBottom: 30 }}>
            Start trading with AI-powered insights
          </p>

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
          />

          <button onClick={handleSignUp} style={buttonStyle} disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div style={{ marginTop: 20, textAlign: "center", color: "#9ca3af" }}>
            Already have an account?{" "}
            <span style={linkStyle} onClick={() => navigate("/signin")}>
              Sign In
            </span>
          </div>
        </div>
      </div>
    </>
  );
}