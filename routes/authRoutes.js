const express = require('express');
const router = express.Router();
const { login, register, logout } = require('../controllers/authController'); // Make sure this import is correct

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout); 

module.exports = router;
