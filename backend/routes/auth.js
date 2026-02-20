const express = require('express');
const router = express.Router();

const {
  signUp,
  signIn,
  sendVerificationEmail
} = require('../controllers/authController');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/verify-email', sendVerificationEmail);   // IMPORTANT

module.exports = router;
