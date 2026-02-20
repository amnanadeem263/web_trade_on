import React, { useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function VerifyEmail() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload();

        if (user.emailVerified) {
          navigate("/connect-binance", { replace: true });
        }
      } else {
        // If no user logged in, redirect to signin
        navigate("/signin", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <h2>Verify Your Email</h2>
        <p>Please check your Gmail and click the verification link.</p>
        <p>You will be redirected automatically after verification.</p>
      </div>
    </>
  );
}