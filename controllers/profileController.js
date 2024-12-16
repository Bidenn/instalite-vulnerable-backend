const { Op } = require("sequelize");
const { User, Post } = require("../models");

const getUserProfile = async (req, res) => {
    try {
        const loggedUser = req.query.loggedUser;

        const user = await User.findOne({
            where: { username: loggedUser },
            attributes: ["id", "photo", "username", "fullname", "bio", "career"],
        });

        if (!user) {
            return res.status(404).json({ error: "Profile not found" });
        }

        const posts = await Post.findAll({
            where: { userId: user.id },
            attributes: ["id", "caption", "content", "createdAt"],
            order: [["createdAt", "DESC"]],
        });

        res.json({ user, posts });
    } catch (error) {
        console.error("Error fetching user profile with posts:", error);
        res.status(500).json({ error: "Failed to fetch user profile with posts" });
    }
};

const editUserProfile = async (req, res) => {
    try {
        const loggedUser = req.query.loggedUser;

        const whereCondition = isNaN(Number(loggedUser))
            ? { username: loggedUser }
            : { id: loggedUser };

        const user = await User.findOne({
            where: whereCondition,
            attributes: ['email', 'username', 'password', 'fullname', 'photo', 'bio', 'career'],
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Failed to retrieve profile data : ', error);
        res.status(500).json({ error: 'Failed to retrieve profile data : ', details: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const loggedUser = req.query.loggedUser;

        const whereCondition = isNaN(Number(loggedUser))
            ? { username: loggedUser }
            : { id: loggedUser };

        const { username, fullname, career, bio } = req.body;
        const photo = req.file?.filename;

        const user = await User.findOne({
            where: whereCondition,
            attributes: ['id', 'email', 'username', 'password', 'fullname', 'photo', 'bio', 'career'],
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (username && username !== user.username) {
            const usernameRegex = /^[a-z0-9_]+(\.[a-z0-9_]+)*$/;

            if (!usernameRegex.test(username)) {
                return res.status(400).json({
                    error: "Username is invalid. Only lowercase letters, numbers, underscores, and dots (not at the end) are allowed, and it cannot contain spaces."
                });
            }

            const existingUser = await User.findOne({ where: { username } });

            if (existingUser) {
                return res.status(409).json({ error: "Username is already taken" });
            }
        }

        user.username = username || user.username;
        user.fullname = fullname || user.fullname;
        user.bio = bio || user.bio;
        user.career = career || user.career;
        if (photo) user.photo = photo;

        await user.save();

        res.status(200).json({
            status: "success",
            message: "Profile updated successfully!",
            loggedUser: username,
        });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

const checkUsername = async (req, res) => {
    try {
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        const usernameRegex = /^[a-z0-9_]+(\.[a-z0-9_]+)*$/;

        if (!usernameRegex.test(username)) {
            return res.status(200).json({ status: 'invalid' });
        }

        const existingUser = await User.findOne({ where: { username } });

        if (existingUser) {
            return res.status(200).json({ status: 'unavailable' });
        } else {
            res.status(200).json({ status: 'available' });
        }
    } catch (error) {
        console.error("Error checking username availability:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getPublicProfile = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({
            where: { username },
            attributes: ["id", "photo", "username", "fullname", "bio", "career"],
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        } else {
            const posts = await Post.findAll({
                where: { userId: user.id },
                attributes: ["id", "caption", "content", "createdAt"],
                order: [["createdAt", "DESC"]],
            });
            res.json({ user, posts });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const searchPublicProfile = async (req, res) => {
    try {
        const authUsername = req.query.loggedUser;
        const query = req.params.username;

        if (!query) {
            return res.status(400).json({ error: "Username is required" });
        }

        const users = await User.findAll({
            where: {
                [Op.and]: [
                    {
                        username: {
                            [Op.iLike]: `%${query}%`,
                        },
                    },
                    {
                        username: {
                            [Op.ne]: authUsername,
                        },
                    },
                ],
            },
            attributes: ['username', 'photo'],
            limit: 20,
        });

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        const formattedUsers = users.map((user) => ({
            username: user.username,
            profilePhoto: user.photo,
        }));

        return res.status(200).json(formattedUsers);

    } catch (error) {
        console.error("Error searching profiles:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getUserProfile,
    editUserProfile,
    updateUserProfile,
    checkUsername,
    getPublicProfile,
    searchPublicProfile
};
