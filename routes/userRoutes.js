const express = require('express');
const router = express.Router();
const { getProfileWithoutPost, getProfileWithPosts, updateUserProfile } = require('../controllers/userController');

router.get('/:userId/edit', getProfileWithoutPost);
router.get('/:userId', getProfileWithPosts);
router.put('/:userId/update', updateUserProfile);

module.exports = router;
