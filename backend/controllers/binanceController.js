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



/* ================= CONNECT BINANCE + START BOT ================= */

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

    // Save encrypted keys
    await db.collection("users").doc(uid).set(
      {
        binance: {
          apiKey: encrypt(apiKey.trim()),
          secretKey: encrypt(secretKey.trim()),
          connected: true,
          connectedAt: new Date(),
          botRunning: true
        }
      },
      { merge: true }
    );

    // Start Python Bot
    await axios.post(
      `${process.env.PY_TRADE_URL}/start-bot`,
      {
        uid,
        apiKey: apiKey.trim(),
        secretKey: secretKey.trim()
      },
      {
        headers: {
          "X-API-KEY": process.env.PY_API_KEY
        },
        timeout: 20000
      }
    );

    return res.json({
      success: true,
      connected: true,
      botRunning: true,
      summary: {
        totalWalletBalance: account.totalWalletBalance,
        totalMarginBalance: account.totalMarginBalance,
        availableBalance: account.availableBalance,
        totalUnrealizedProfit: account.totalUnrealizedProfit,
        positions: account.positions || [],
        assets: account.assets || []
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

  const binanceData = doc.data().binance;

  try {
    const decryptedKey = decrypt(binanceData.apiKey);
    const decryptedSecret = decrypt(binanceData.secretKey);

    const account = await getFuturesAccount(
      decryptedKey,
      decryptedSecret
    );

    return res.json({
      connected: true,
      botRunning: binanceData.botRunning || false,
      summary: {
        totalWalletBalance: account.totalWalletBalance,
        totalMarginBalance: account.totalMarginBalance,
        availableBalance: account.availableBalance,
        totalUnrealizedProfit: account.totalUnrealizedProfit,
        positions: account.positions || [],
        assets: account.assets || []
      }
    });

  } catch (error) {
    return res.json({
      connected: true,
      botRunning: false,
      error: "Failed to fetch Binance account"
    });
  }
};

/* ================= DISCONNECT ================= */

const disconnectBinance = async (req, res) => {
  const uid = req.user.uid;

  try {
    await axios.post(
      `${process.env.PY_TRADE_URL}/stop-bot`,
      { uid },
      {
        headers: { "X-API-KEY": process.env.PY_API_KEY }
      }
    );
  } catch (e) {
    console.log("Python stop bot failed");
  }

  await db.collection("users").doc(uid).set(
    { binance: null },
    { merge: true }
  );

  res.json({ success: true, connected: false, botRunning: false });
};

module.exports = {
  connectBinance,
  checkStatus,
  disconnectBinance
};