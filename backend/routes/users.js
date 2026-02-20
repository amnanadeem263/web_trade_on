// routes/users.js
const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../controllers/userController');

router.get('/', getAllUsers);
router.delete('/:uid', deleteUser);

module.exports = router;
