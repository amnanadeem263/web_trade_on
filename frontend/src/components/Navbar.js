import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [binanceConnected, setBinanceConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if (snap.exists() && snap.data().binance?.connected) {
          setBinanceConnected(true);
        } else {
          setBinanceConnected(false);
        }
      } else {
        setBinanceConnected(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  /* ================= PAGE TYPE CHECK ================= */

  const isAuthPage =
    location.pathname === "/signin" ||
    location.pathname === "/signup" ||
    location.pathname === "/verify-email";

  const isLandingPage = location.pathname === "/";

  /* ================= STYLES ================= */

  const navStyle = {
    background: "#0f172a",
    padding: "15px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.08)"
  };

  const linkStyle = {
    marginLeft: "20px",
    cursor: "pointer",
    color: "#e5e7eb",
    fontWeight: 500
  };

  const activeStyle = {
    ...linkStyle,
    color: "#3b82f6"
  };

  const buttonStyle = {
    background: "#2563eb",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    marginLeft: "20px"
  };

  return (
    <nav style={navStyle}>
      {/* LOGO */}
      <div
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          cursor: "pointer",
          color: "#3b82f6"
        }}
        onClick={() => navigate("/")}
      >
        TradeOn
      </div>

      <div>
        {/* ================= AUTH PAGES ================= */}
        {isAuthPage && (
          <>
            {!user && (
              <>
                <span
                  style={location.pathname === "/signin" ? activeStyle : linkStyle}
                  onClick={() => navigate("/signin")}
                >
                  Sign In
                </span>

                <button style={buttonStyle} onClick={() => navigate("/signup")}>
                  Get Started
                </button>
              </>
            )}

            {user && (
              <span style={linkStyle} onClick={logout}>
                Logout
              </span>
            )}
          </>
        )}

        {/* ================= LANDING PAGE ================= */}
        {!isAuthPage && isLandingPage && !user && (
          <>
            <span style={linkStyle} onClick={() => navigate("/signin")}>
              Sign In
            </span>

            <button style={buttonStyle} onClick={() => navigate("/signup")}>
              Get Started
            </button>
          </>
        )}

        {/* ================= LOGGED IN BUT NOT CONNECTED ================= */}
        {!isAuthPage && user && !binanceConnected && (
          <>
            <span
              style={
                location.pathname === "/connect-binance"
                  ? activeStyle
                  : linkStyle
              }
              onClick={() => navigate("/connect-binance")}
            >
              Connect Binance
            </span>

            <span style={linkStyle} onClick={logout}>
              Logout
            </span>
          </>
        )}

        {/* ================= LOGGED IN + CONNECTED ================= */}
        {!isAuthPage && user && binanceConnected && (
          <>
            <span
              style={
                location.pathname === "/connect-binance"
                  ? activeStyle
                  : linkStyle
              }
              onClick={() => navigate("/connect-binance")}
            >
              Connect Binance
            </span>

            <span style={linkStyle} onClick={() => navigate("/connect-binance")}>
              Positions
            </span>

            <span style={linkStyle} onClick={() => navigate("/connect-binance")}>
              Assets
            </span>

            <span style={linkStyle} onClick={logout}>
              Logout
            </span>
          </>
        )}
      </div>
    </nav>
  );
}