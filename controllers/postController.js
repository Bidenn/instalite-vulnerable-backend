const { Post, User, Comment, Like } = require('../models');

const storePost = async (req, res) => {
    try {
        const { loggedUser, caption } = req.body;

        if (!caption) {
            return res.status(400).json({ error: 'Caption is required' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const imageUrl = req.file.filename;

        const postAuthor = await User.findOne({
            where: {username : loggedUser},
            attributes: ['id'],
        });

        const storePost = await Post.create({
            userId: postAuthor.id,
            caption,
            content: imageUrl,
        });

        res.status(201).json({
            message: 'Post created successfully!',
        });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

const detailPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findOne({
            where: { id: postId },
            include: {
                model: User, 
                as: 'author', 
                attributes: ['id', 'username', 'photo'], 
            },
        });

        const comments = await Comment.findAll({
            where: { postId: postId },
            include: {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'photo'], 
            }
        });

        const likes = await Like.findAll({
            where: { postId: postId }
        });

        const totalLikes = likes.length;

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        return res.status(201).json({ post: post, comments: comments, totalLikes: totalLikes });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve post details', details: error.message });
    }
};

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


module.exports = { storePost, deletePost, detailPost };