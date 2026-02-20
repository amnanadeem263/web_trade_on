import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { auth } from "../firebase";

const API_BASE = "http://localhost:5000";

const ConnectBinance = () => {
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [riskSettings] = useState({
    maxTradePercent: 5,
    maxLeverage: 5,
    dailyLossLimit: 10
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
        { apiKey, secretKey, riskSettings },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(response.data);

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

      setResult(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [getToken]);

  const disconnect = async () => {
    const token = await getToken();
    await axios.delete(
      `${API_BASE}/api/binance/disconnect`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setResult({ connected: false });
  };

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>Connect Binance Futures</h2>

      <input
        type="text"
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        type="password"
        placeholder="Secret Key"
        value={secretKey}
        onChange={(e) => setSecretKey(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 20 }}
      />

      <button onClick={connectBinance} disabled={loading}>
        {loading ? "Connecting..." : "Connect Binance"}
      </button>

      <button
        onClick={disconnect}
        style={{ marginLeft: 10, background: "red", color: "white" }}
      >
        Disconnect
      </button>

      {result && result.summary && (
        <div style={{ marginTop: 30 }}>
          <h3>Binance Futures Account Info</h3>

          <p>Total Wallet Balance: {result.summary.totalWalletBalance}</p>
          <p>Available Balance: {result.summary.availableBalance}</p>
          <p>Total Margin Balance: {result.summary.totalMarginBalance}</p>
          <p>Unrealized PNL: {result.summary.totalUnrealizedProfit}</p>

          <h4>Assets</h4>
          {result.summary.assets
            ?.filter(a => Number(a.walletBalance) > 0)
            .map(a => (
              <div key={a.asset}>
                {a.asset} — {a.walletBalance}
              </div>
            ))}

          <h4>Open Positions</h4>
          {result.summary.positions
            ?.filter(p => Number(p.positionAmt) !== 0)
            .map(p => (
              <div key={p.symbol}>
                {p.symbol} — Size: {p.positionAmt} — PNL: {p.unrealizedProfit}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ConnectBinance;