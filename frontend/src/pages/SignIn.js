import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import Navbar from "../components/Navbar";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSignIn = async () => {
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (!userCredential.user.emailVerified) {
        alert("Please verify your email first.");
        setLoading(false);
        return;
      }

      navigate("/connect-binance");
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
          <h2 style={{ marginBottom: 10 }}>Welcome Back</h2>
          <p style={{ color: "#9ca3af", marginBottom: 30 }}>
            Sign in to access your trading dashboard
          </p>

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

          <button
            onClick={handleEmailSignIn}
            style={buttonStyle}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div style={{ marginTop: 20, textAlign: "center", color: "#9ca3af" }}>
            Don’t have an account?{" "}
            <span style={linkStyle} onClick={() => navigate("/signup")}>
              Create Account
            </span>
          </div>
        </div>
      </div>
    </>
  );
}