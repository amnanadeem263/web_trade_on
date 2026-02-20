import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { auth } from "../firebase";
import Navbar from "../components/Navbar";

const API_BASE = "http://localhost:5000";

const ConnectBinance = () => {
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("positions");

  /* ================= AUTH TOKEN ================= */

  const getToken = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Login required");
    return await user.getIdToken();
  }, []);

  /* ================= CONNECT ================= */

  const connectBinance = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const response = await axios.post(
        `${API_BASE}/api/binance/connect`,
        { apiKey, secretKey },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(response.data);
      setApiKey("");
      setSecretKey("");
    } catch (error) {
      setResult({
        success: false,
        error: error?.response?.data?.error || error.message
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATUS ================= */

  const checkStatus = useCallback(async () => {
    try {
      setRefreshing(true);
      const token = await getToken();

      const response = await axios.get(
        `${API_BASE}/api/binance/status`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  }, [getToken]);

  /* ================= DISCONNECT ================= */

  const disconnectBinance = async () => {
    try {
      const token = await getToken();

      await axios.delete(
        `${API_BASE}/api/binance/disconnect`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult({ connected: false });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const isConnected = result?.connected === true;
  const summary = result?.summary;
  const positions =
    summary?.positions?.filter(p => Number(p.positionAmt) !== 0) || [];
  const assets =
    summary?.assets?.filter(a => Number(a.walletBalance) > 0) || [];

  /* ================= STYLES ================= */

  const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#0f172a,#0b0f1a)",
    color: "#fff",
    padding: "40px 20px"
  };

  const cardStyle = {
    maxWidth: "1100px",
    margin: "0 auto",
    background: "rgba(20,25,40,0.7)",
    backdropFilter: "blur(12px)",
    borderRadius: "16px",
    padding: "30px",
    border: "1px solid rgba(255,255,255,0.08)"
  };

  const inputStyle = {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "#111827",
    color: "#fff",
    marginRight: "10px"
  };

  const primaryBtn = {
    padding: "12px 18px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    marginRight: "10px"
  };

  const dangerBtn = {
    ...primaryBtn,
    background: "#ef4444"
  };

  const secondaryBtn = {
    ...primaryBtn,
    background: "#1e293b"
  };

  const tableHeader = {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    padding: "14px",
    fontSize: "13px",
    color: "#9ca3af",
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  };

  const tableRow = {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    padding: "16px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    fontSize: "14px"
  };

  return (
    <>
      <Navbar />

      <div style={pageStyle}>
        <div style={cardStyle}>
          <h2 style={{ marginBottom: 20 }}>
            Connected Futures Account
          </h2>

          {/* ================= ENTERPRISE CONNECTION VIEW ================= */}

          {!isConnected && (
            <div style={{ marginBottom: 30 }}>
              <input
                type="text"
                placeholder="API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={inputStyle}
              />

              <input
                type="password"
                placeholder="Secret Key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                style={inputStyle}
              />

              <button onClick={connectBinance} style={primaryBtn}>
                {loading ? "Connecting..." : "Connect"}
              </button>
            </div>
          )}

          {isConnected && (
            <div style={{ marginBottom: 30 }}>
              <div
                style={{
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  padding: "15px",
                  borderRadius: "10px",
                  marginBottom: "15px"
                }}
              >
                🟢 Binance is Connected
              </div>

              <button onClick={disconnectBinance} style={dangerBtn}>
                Disconnect
              </button>

              <button onClick={checkStatus} style={secondaryBtn}>
                {refreshing ? "Refreshing..." : "Reconnect"}
              </button>
            </div>
          )}

          {/* ================= SUMMARY ================= */}

          {summary && (
            <div style={{ marginBottom: 30 }}>
              <div style={{ fontSize: 20, fontWeight: 600 }}>
                Total Balance: {summary.totalWalletBalance} USDT
              </div>

              <div style={{ marginTop: 8 }}>
                Unrealized PNL:{" "}
                <span
                  style={{
                    color:
                      Number(summary.totalUnrealizedProfit) >= 0
                        ? "#22c55e"
                        : "#ef4444",
                    fontWeight: 600
                  }}
                >
                  {summary.totalUnrealizedProfit}
                </span>
              </div>
            </div>
          )}

          {/* ================= TABS ================= */}

          {summary && (
            <>
              <div style={{ display: "flex", marginBottom: 20 }}>
                {["positions", "assets"].map((tab) => (
                  <div
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      marginRight: 25,
                      cursor: "pointer",
                      paddingBottom: 8,
                      fontWeight: 600,
                      borderBottom:
                        activeTab === tab
                          ? "2px solid #3b82f6"
                          : "none"
                    }}
                  >
                    {tab.toUpperCase()}
                  </div>
                ))}
              </div>

              {/* POSITIONS */}
              {activeTab === "positions" && (
                <>
                  {positions.length === 0 ? (
                    <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
                      You have no open positions.
                    </div>
                  ) : (
                    <>
                      <div style={tableHeader}>
                        <div>Symbol</div>
                        <div>Size</div>
                        <div>Entry</div>
                        <div>Mark</div>
                        <div>PNL</div>
                      </div>

                      {positions.map((p) => (
                        <div key={p.symbol} style={tableRow}>
                          <div>{p.symbol}</div>
                          <div>{p.positionAmt}</div>
                          <div>{p.entryPrice}</div>
                          <div>{p.markPrice}</div>
                          <div
                            style={{
                              color:
                                Number(p.unrealizedProfit) >= 0
                                  ? "#22c55e"
                                  : "#ef4444"
                            }}
                          >
                            {p.unrealizedProfit}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}

              {/* ASSETS */}
              {activeTab === "assets" && (
                <>
                  <div style={tableHeader}>
                    <div>Asset</div>
                    <div>Wallet</div>
                    <div>Available</div>
                    <div></div>
                    <div></div>
                  </div>

                  {assets.map((a) => (
                    <div key={a.asset} style={tableRow}>
                      <div>{a.asset}</div>
                      <div>{a.walletBalance}</div>
                      <div>{a.availableBalance}</div>
                      <div></div>
                      <div></div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ConnectBinance;