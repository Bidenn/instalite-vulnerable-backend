// routes/homeRoutes.js
const express = require('express');
const router = express.Router();
const { homepage } = require('../controllers/homepageController');

router.get('', homepage);

module.exports = router;
