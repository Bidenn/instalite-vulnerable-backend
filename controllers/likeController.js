const Like = require('../models/Like'); 
const Post = require('../models/Post');
const User = require('../models/User');

const toggleLikePost = async (req, res) => {
    try {
        const { postId, loggedUser } = req.body;

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const user = await User.findOne({
            where: { username: loggedUser },
            attributes: ['id'],
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existingLike = await Like.findOne({
            where: {
                postId,
                userId: user.id,
            },
        });

        if (existingLike) {
            await existingLike.destroy();
            return res.status(200).json({ success: true, message: 'Post unliked successfully' });
        } else {
            const newLike = await Like.create({
                postId,
                userId: user.id,
            });
            return res.status(201).json({ success: true, like: newLike, message: 'Post liked successfully' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { toggleLikePost };
