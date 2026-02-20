// controllers/binanceController.js

const axios = require("axios");
const crypto = require("crypto");
const { db } = require("../firebaseAdmin");
const { encrypt, decrypt } = require("../utils/encryption");

/* ================= SIGN REQUEST ================= */

const signQuery = (query, secret) => {
  return crypto.createHmac("sha256", secret).update(query).digest("hex");
};

/* ================= GET FUTURES ACCOUNT ================= */

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

/* ================= CONNECT BINANCE ================= */

const connectBinance = async (req, res) => {
  const { apiKey, secretKey } = req.body;

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

    /* ===== SAVE INSIDE USERS COLLECTION (CORRECT STRUCTURE) ===== */

    await db.collection("users").doc(uid).set(
      {
        binance: {
          apiKey: encrypt(apiKey.trim()),
          secretKey: encrypt(secretKey.trim()),
          connected: true,
          connectedAt: new Date()
        }
      },
      { merge: true }
    );

    /* ===== FILTER DATA SAFELY ===== */

    const openPositions = (account.positions || []).filter(
      p => Math.abs(Number(p.positionAmt || 0)) > 0
    );

    const activeAssets = (account.assets || []).filter(
      a => Number(a.walletBalance || 0) > 0
    );

    return res.json({
      success: true,
      summary: {
        totalWalletBalance: account.totalWalletBalance,
        totalMarginBalance: account.totalMarginBalance,
        availableBalance: account.availableBalance,
        totalUnrealizedProfit: account.totalUnrealizedProfit,
        positions: openPositions,
        assets: activeAssets
      }
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error?.response?.data?.msg || error.message
    });
  }
};

/* ================= CHECK STATUS ================= */

const checkStatus = async (req, res) => {
  const uid = req.user.uid;

  const doc = await db.collection("users").doc(uid).get();

  if (!doc.exists || !doc.data().binance) {
    return res.json({ connected: false });
  }

  try {
    const binanceData = doc.data().binance;

    const decryptedKey = decrypt(binanceData.apiKey);
    const decryptedSecret = decrypt(binanceData.secretKey);

    const account = await getFuturesAccount(
      decryptedKey,
      decryptedSecret
    );

    /* ===== SAFE FILTERING ===== */

    const openPositions = (account.positions || []).filter(
      p => Math.abs(Number(p.positionAmt || 0)) > 0
    );

    const activeAssets = (account.assets || []).filter(
      a => Number(a.walletBalance || 0) > 0
    );

    return res.json({
      connected: true,
      summary: {
        totalWalletBalance: account.totalWalletBalance,
        totalMarginBalance: account.totalMarginBalance,
        availableBalance: account.availableBalance,
        totalUnrealizedProfit: account.totalUnrealizedProfit,
        positions: openPositions,
        assets: activeAssets
      }
    });

  } catch (error) {
    return res.status(400).json({
      connected: true,
      error: "Failed to fetch Binance account"
    });
  }
};

/* ================= DISCONNECT ================= */

const disconnectBinance = async (req, res) => {
  await db.collection("users").doc(req.user.uid).set(
    {
      binance: null
    },
    { merge: true }
  );

  res.json({ success: true });
};

module.exports = {
  connectBinance,
  checkStatus,
  disconnectBinance
};