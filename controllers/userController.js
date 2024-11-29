const User = require('../models/User');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const { upload } = require('../middlewares/uploadUser');

const getProfileWithoutPost = async (req, res) => {
  try {
    const { userId } = req.params;  // Get the userId from URL parameters

    const user = await User.findOne({
      where: { id: userId },
      attributes: ['id', 'username', 'password', 'fullName', 'profilePhoto', 'aboutMe', 'career'],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user
    });
  } catch (error) {
    console.error('Failed to retrieve profile data : ', error);
    res.status(500).json({ error: 'Failed to retrieve profile data : ', details: error.message });
  }
};

const getProfileWithPosts = async (req, res) => {
  try {
    const { userId } = req.params;  // Get the userId from URL parameters

    console.log(userId);

    const user = await User.findOne({
      where: { id: userId },
      attributes: ['id', 'username', 'fullName', 'profilePhoto', 'aboutMe', 'career'],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = await Post.findAll({
      where: { userId },
      attributes: ['id', 'caption', 'content', 'createdAt'],
      order: [['createdAt', 'DESC']],  // Optional: order posts by creation date
    });

    console.log(posts);


    res.json({
      user,
      posts: posts || [],  // Ensure posts is always an array, even if null
    });
  } catch (error) {
    console.error('Failed to retrieve profile and posts:', error);
    res.status(500).json({ error: 'Failed to retrieve profile and posts', details: error.message });
  }
};

const updateUserProfile = [
  upload.single('profilePhoto'), // Handle profile photo upload
  async (req, res) => {
    try {
      const { fullName, career, aboutMe, username, password } = req.body;
      const { userId } = req.params;

      // Check if required fields are present
      if (!username) {
        return res.status(400).json({ error: 'Username is required' });
      }

      // If a file is uploaded, use its filename (not full path) as profilePhoto
      const profilePhoto = req.file ? req.file.filename : null;

      // Prepare data for update
      const updateData = { fullName, career, aboutMe, username, password };
      if (profilePhoto) updateData.profilePhoto = profilePhoto;

      // Execute update operation
      const [updated] = await User.update(updateData, { where: { id: userId } });

      // Check if the update affected any rows
      if (!updated) {
        return res.status(404).json({ error: 'User not found or no changes made' });
      }

      // Respond with success and the profile photo filename
      res.status(200).json({
        message: 'Profile updated successfully!',
        profilePhoto: profilePhoto || 'No new photo uploaded',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({
        error: 'Error updating profile. Please try again.',
        details: error.message,
      });
    }
  }
];

module.exports = { getProfileWithPosts, updateUserProfile, getProfileWithoutPost };
