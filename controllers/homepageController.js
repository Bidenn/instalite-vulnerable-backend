const {Post,User} = require('../models');

const homepage = async (req, res) => {
    try {
        const { loggedUser } = req.query;

        if (!loggedUser) {
            return res.status(400).json({ error: 'not authorized' });
        }

        const checkUser = await User.findOne({
            where: { username: loggedUser },
            attributes: ['id', 'username', 'photo'],
        });

        if (!checkUser) {
            return res.status(404).json({ error: 'Logged-in user not found' });
        }

        const posts = await Post.findAll({
            include: [{
                model: User,
                as: 'author', 
                attributes: ['id', 'username', 'photo'],
            }],
            order: [['createdAt', 'DESC']],
        });

        res.json({
            message: 'Posts and logged-in user data retrieved successfully',
            posts: posts || [],
            loggedUser: checkUser,
        });

    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to retrieve posts', details: error.message });
    }
};

module.exports = { homepage };
