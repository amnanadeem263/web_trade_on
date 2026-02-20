// controllers/authController.js
const { auth, db } = require('../firebaseAdmin');



// ===== SIGNUP =====
const signUp = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }

  try {
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: fullName,
    });

    // Save user in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      fullName,
      email,
      createdAt: new Date()
    });

    return res.json({ success: true, uid: userRecord.uid });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

// ===== SIGNIN =====
const signIn = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ success: false, error: 'Email is required' });

  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord.emailVerified) {
      return res.status(401).json({ success: false, error: 'Email not verified' });
    }

    // Generate custom token for client sign-in
    const token = await auth.createCustomToken(userRecord.uid);

    return res.json({ success: true, token });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};


// SEND EMAIL VERIFICATION LINK
const sendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  console.log("VERIFY EMAIL API HIT:", email);   // ADD THIS

  try {
    const link = await auth.generateEmailVerificationLink(email);

    console.log("Verification Link:", link);     // ADD THIS

    return res.json({
      success: true,
      link
    });

  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};


module.exports = { signUp, signIn , sendVerificationEmail };
