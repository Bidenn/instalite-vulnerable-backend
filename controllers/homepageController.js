const Post = require('../models/Post');
const User = require('../models/User');

const homepage = async (req, res) => {
    try {
        const { userId } = req.query;  // Get the logged-in userId from query params

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Fetch the logged-in user data
        const loggedUser = await User.findByPk(userId, {
            attributes: ['id', 'username', 'profilePhoto'], // Fetch relevant user details
        });

        if (!loggedUser) {
            return res.status(404).json({ error: 'Logged-in user not found' });
        }

        // Fetch all posts with associated user data
        const queryOptions = {
            include: [{
                model: User,
                as: 'user', // The alias defined in the association
                attributes: ['id', 'username', 'profilePhoto'], // Include user details
            }],
            order: [['createdAt', 'DESC']], // Order posts by creation date
        };

        // Fetch the posts from the database
        const posts = await Post.findAll(queryOptions);

        // Send the posts and logged-in user data as response
        res.json({
            message: 'Posts and logged-in user data retrieved successfully',
            posts: posts || [],  // Ensure posts is always an array, even if null
            loggedUser,
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to retrieve posts', details: error.message });
    }
};

module.exports = { homepage };
