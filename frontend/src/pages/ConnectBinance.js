import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { auth } from "../firebase";
import Navbar from "../components/Navbar";
import "../styles/connectBinance.css";

const API_BASE = "http://localhost:5000";

const ConnectBinance = () => {
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("positions");

  const getToken = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Login required");
    return await user.getIdToken();
  }, []);

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

  const checkStatus = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${API_BASE}/api/binance/status`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(prev => ({ ...prev, ...response.data }));
    } catch (error) {
      console.log(error);
    }
  }, [getToken]);

  const disconnectBinance = async () => {
    try {
      const token = await getToken();
      await axios.delete(
        `${API_BASE}/api/binance/disconnect`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult({ connected: false, botRunning: false });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  useEffect(() => {
    if (!result?.connected) return;
    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, [result?.connected, checkStatus]);

  const summary = result?.summary || {};
  const positions = summary.positions?.filter(p => Number(p.positionAmt) !== 0) || [];
  const assets = summary.assets?.filter(a => Number(a.walletBalance) > 0) || [];
  

  return (
    <>
      <Navbar />
      <div className="tradeon-page">
        <div className="tradeon-container">

          <h1>Binance Futures Automation</h1>

          {!result?.connected && (
            <div className="glass-card">
              <input
                className="tradeon-input"
                placeholder="API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <input
                className="tradeon-input"
                type="password"
                placeholder="Secret Key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
              />
              <button className="btn-primary" onClick={connectBinance}>
                {loading ? "Connecting..." : "Connect & Start Bot"}
              </button>
            </div>
          )}

          {result?.connected && (
            <>
              <div className="glass-card">
                <div className={result?.botRunning ? "status-badge" : "status-badge red"}>
                  {result?.botRunning ? "● Strategy ACTIVE" : "● Strategy Stopped"}
                </div>
                <br /><br />
                <button className="btn-primary btn-danger" onClick={disconnectBinance}>
                  Disconnect & Stop Bot
                </button>
              </div>

              <div className="summary-grid">
                <div className="summary-card">
                  <p>Total Balance</p>
                  <h2>{summary.totalWalletBalance || 0} USDT</h2>
                </div>
                <div className="summary-card">
                  <p>Available Balance</p>
                  <h2>{summary.availableBalance || 0} USDT</h2>
                </div>
                <div className="summary-card">
                  <p>Margin Balance</p>
                  <h2>{summary.totalMarginBalance || 0} USDT</h2>
                </div>
                <div className="summary-card">
                  <p>Unrealized PNL</p>
                  <h2 className={
                    Number(summary.totalUnrealizedProfit) >= 0
                      ? "pnl-positive"
                      : "pnl-negative"
                  }>
                    {summary.totalUnrealizedProfit || 0}
                  </h2>
                </div>
              </div>

              <div className="tradeon-tabs">
                <span
                  className={`tradeon-tab ${activeTab === "positions" ? "active" : ""}`}
                  onClick={() => setActiveTab("positions")}
                >
                  POSITIONS
                </span>
                <span
                  className={`tradeon-tab ${activeTab === "assets" ? "active" : ""}`}
                  onClick={() => setActiveTab("assets")}
                >
                  ASSETS
                </span>
              </div>

              {activeTab === "positions" && (
                <div className="glass-card">
                  <div className="tradeon-table-header">
                    <div>Symbol</div>
                    <div>Size</div>
                    <div>Entry</div>
                    <div>Mark</div>
                    <div>PNL</div>
                  </div>
                  {positions.map((p) => (
                    <div key={p.symbol} className="tradeon-table-row">
                      <div>{p.symbol}</div>
                      <div>{p.positionAmt}</div>
                      <div>{p.entryPrice}</div>
                      <div>{p.markPrice}</div>
                      <div className={
                        Number(p.unrealizedProfit) >= 0
                          ? "pnl-positive"
                          : "pnl-negative"
                      }>
                        {p.unrealizedProfit}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "assets" && (
                <div className="glass-card">
                  <div className="tradeon-table-header">
                    <div>Asset</div>
                    <div>Wallet</div>
                    <div>Available</div>
                    <div></div>
                    <div></div>
                  </div>
                  {assets.map((a) => (
                    <div key={a.asset} className="tradeon-table-row">
                      <div>{a.asset}</div>
                      <div>{a.walletBalance}</div>
                      <div>{a.availableBalance}</div>
                      <div></div>
                      <div></div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ConnectBinance;