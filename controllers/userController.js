const User = require('../models/User');
const Post = require('../models/Post');
const { upload } = require('../middlewares/uploadUser');
const { Op } = require("sequelize");

const getProfileWithoutPost = async (req, res) => {
  try {
    const { userId } = req.params;

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
    const { userId } = req.params; 

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
      order: [['createdAt', 'DESC']],  
    });

    res.json({
      user,
      posts: posts || [], 
    });
  } catch (error) {
    console.error('Failed to retrieve profile and posts:', error);
    res.status(500).json({ error: 'Failed to retrieve profile and posts', details: error.message });
  }
};

const updateUserProfile = [
  upload.single('profilePhoto'), 
  async (req, res) => {
    try {
      const { fullName, career, aboutMe, username, password } = req.body;
      const { userId } = req.params;

      if (!username) {
        return res.status(400).json({ error: 'Username is required' });
      }
      if (!password) {
        return res.status(400).json({ error: 'Password is required' });
      }

      const existingUser = await User.findOne({
        where: {
          username: username,
          id: { [Op.ne]: userId }, 
        },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Username is already taken' });
      }

      const profilePhoto = req.file ? req.file.filename : null;

      const updateData = { fullName, career, aboutMe, username, password };
      if (profilePhoto) updateData.profilePhoto = profilePhoto;

      const [updated] = await User.update(updateData, { where: { id: userId } });

      if (!updated) {
        return res.status(404).json({ error: 'User not found or no changes made' });
      }

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
