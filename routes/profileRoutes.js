const express = require('express');
const router = express.Router();
const { 
    getUserProfile, 
    editUserProfile, 
    updateUserProfile,
    checkUsername,
    getPublicProfile,
    searchPublicProfile,
} = require('../controllers/profileController');
const { upload } = require('../middlewares/uploadUser');

router.get('/profile', getUserProfile);
router.get('/edit', editUserProfile);
router.put('/update', upload.single('photo'), updateUserProfile);
router.get('/check-username', checkUsername);
router.get('/:username', getPublicProfile);
router.get('/search/:username', searchPublicProfile);

module.exports = router;
