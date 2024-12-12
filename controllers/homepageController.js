const Post = require('../models/Post');
const User = require('../models/User');

const homepage = async (req, res) => {
    try {
        const { userId } = req.query; 

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const loggedUser = await User.findByPk(userId, {
            attributes: ['id', 'username', 'profilePhoto'],
        });

        if (!loggedUser) {
            return res.status(404).json({ error: 'Logged-in user not found' });
        }

        const queryOptions = {
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'profilePhoto'],
            }],
            order: [['createdAt', 'DESC']], 
        };

        const posts = await Post.findAll(queryOptions);

        res.json({
            message: 'Posts and logged-in user data retrieved successfully',
            posts: posts || [], 
            loggedUser,
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to retrieve posts', details: error.message });
    }
};

module.exports = { homepage };
