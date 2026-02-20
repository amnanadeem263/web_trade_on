// routes/binance.js

const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const {
  connectBinance,
  checkStatus,
  disconnectBinance
} = require("../controllers/binanceController");

router.post("/connect", verifyToken, connectBinance);
router.get("/status", verifyToken, checkStatus);
router.delete("/disconnect", verifyToken, disconnectBinance);

module.exports = router;