const Post = require('../models/Post');
const { upload } = require('../middlewares/uploadPost');
const User = require('../models/User');

const storePost = [
  upload.single('content'),
  async (req, res) => {
    try {
      const { userId, caption } = req.body;

      if (!caption) {
        return res.status(400).json({ error: 'Caption is required' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'Please upload an image' });
      }

      const imageUrl = req.file.filename;

      const post = await Post.create({
        userId,
        caption,
        content: imageUrl,
      });

      res.status(201).json({
        message: 'Post created successfully!',
        postId: post.id,
        imageUrl,
      });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Error creating post. Please try again.', details: error.message });
    }
  }
];


const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await Post.destroy({ where: { id: postId } });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};


const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve posts', details: error.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.findAll({ where: { userId } });
    
    if (posts.length === 0) {
      return res.status(404).json({ error: 'No posts found for this user' });
    }

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve posts for this user', details: error.message });
  }
};

const getPostDetails = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({
      where: { id: postId },
      include: {
        model: User, 
        as: 'user', 
        attributes: ['id', 'username', 'profilePhoto'], 
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve post details', details: error.message });
  }
};

module.exports = { storePost, deletePost, getAllPosts, getUserPosts, getPostDetails };