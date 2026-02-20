// controllers/userController.js

const { db } = require('../firebaseAdmin');

/* ================= GET ALL USERS ================= */

const getAllUsers = async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= DELETE USER ================= */

const deleteUser = async (req, res) => {
  const { uid } = req.params;

  try {
    await db.collection('users').doc(uid).delete();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllUsers, deleteUser };