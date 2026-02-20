// controllers/binanceController.js

const axios = require("axios");
const crypto = require("crypto");
const { db } = require("../firebaseAdmin");
const { encrypt, decrypt } = require("../utils/encryption");

// Sign Binance request
const signQuery = (query, secret) => {
  return crypto.createHmac("sha256", secret).update(query).digest("hex");
};

// Get Futures Account Info
const getFuturesAccount = async (apiKey, secretKey) => {
  const timestamp = Date.now();
  const query = `timestamp=${timestamp}`;
  const signature = signQuery(query, secretKey);

  const url = `https://fapi.binance.com/fapi/v2/account?${query}&signature=${signature}`;

  const response = await axios.get(url, {
    headers: { "X-MBX-APIKEY": apiKey }
  });

  return response.data;
};

// CONNECT BINANCE
const connectBinance = async (req, res) => {
  const { apiKey, secretKey, riskSettings } = req.body;

  if (!apiKey || !secretKey) {
    return res.status(400).json({
      success: false,
      error: "API Key and Secret Key required"
    });
  }

  try {
    const account = await getFuturesAccount(
      apiKey.trim(),
      secretKey.trim()
    );

    const uid = req.user.uid;

    await db.collection("binanceConnections").doc(uid).set({
      apiKey: encrypt(apiKey.trim()),
      secretKey: encrypt(secretKey.trim()),
      riskSettings,
      createdAt: new Date()
    });

    return res.json({
      success: true,
      perms: {
        canTrade: account.canTrade,
        canWithdraw: account.canWithdraw
      },
      summary: {
        totalWalletBalance: account.totalWalletBalance,
        totalMarginBalance: account.totalMarginBalance,
        availableBalance: account.availableBalance,
        totalUnrealizedProfit: account.totalUnrealizedProfit,
        totalMaintMargin: account.totalMaintMargin,
        totalInitialMargin: account.totalInitialMargin,
        assets: account.assets,
        positions: account.positions
      }
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error?.response?.data?.msg || error.message
    });
  }
};

// CHECK STATUS
const checkStatus = async (req, res) => {
  const uid = req.user.uid;

  const doc = await db.collection("binanceConnections").doc(uid).get();

  if (!doc.exists) {
    return res.json({ connected: false });
  }

  const data = doc.data();

  try {
    const apiKey = decrypt(data.apiKey);
    const secretKey = decrypt(data.secretKey);

    const account = await getFuturesAccount(apiKey, secretKey);

    return res.json({
      connected: true,
      perms: {
        canTrade: account.canTrade,
        canWithdraw: account.canWithdraw
      },
      summary: {
        totalWalletBalance: account.totalWalletBalance,
        totalMarginBalance: account.totalMarginBalance,
        availableBalance: account.availableBalance,
        totalUnrealizedProfit: account.totalUnrealizedProfit,
        totalMaintMargin: account.totalMaintMargin,
        totalInitialMargin: account.totalInitialMargin,
        assets: account.assets,
        positions: account.positions
      }
    });

  } catch (error) {
    return res.status(400).json({
      connected: true,
      error: "Failed to fetch Binance account"
    });
  }
};

// DISCONNECT
const disconnectBinance = async (req, res) => {
  await db.collection("binanceConnections")
    .doc(req.user.uid)
    .delete();

  res.json({ success: true });
};

module.exports = {
  connectBinance,
  checkStatus,
  disconnectBinance
};