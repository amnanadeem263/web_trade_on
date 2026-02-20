// middleware/verifyToken.js
const { auth } = require('../firebaseAdmin');

const verifyToken = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }

    const idToken = header.split("Bearer ")[1];
    const decoded = await auth.verifyIdToken(idToken);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
};

module.exports = verifyToken;