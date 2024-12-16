const Comment = require('../models/Comment'); 
const Post = require('../models/Post');
const User = require('../models/User');

const storeComment = async (req, res) => {
    try {
        const { postId, comment, loggedUser } = req.body;

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const loggedUserId = await User.findOne({
            where: {username : loggedUser},
            attributes: ['id'],
        });

        const newComment = await Comment.create({
            postId : postId,
            userId : loggedUserId.id,
            text: comment,
        });

        return res.status(201).json({ success: true, comment: newComment });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// const editComment = async (req, res) => {
//     try {
//         const { commentId, commentText } = req.body;
//         const { userId } = req.user; 

//         const comment = await Comment.findByPk(commentId);
//         if (!comment) {
//             return res.status(404).json({ error: 'Comment not found' });
//         }

//         // Check if the user is the author of the comment
//         if (comment.userId !== userId) {
//             return res.status(403).json({ error: 'You are not authorized to edit this comment' });
//         }

//         // Update the comment
//         comment.text = commentText;
//         await comment.save();

//         return res.status(200).json({ success: true, comment });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// };

// const updateComment = async (req, res) => {
//     try {
//         const { commentId, newText } = req.body;
//         const { userId } = req.user; 

//         // Find the comment
//         const comment = await Comment.findByPk(commentId);
//         if (!comment) {
//             return res.status(404).json({ error: 'Comment not found' });
//         }

//         // Check if the user is the author of the comment
//         if (comment.userId !== userId) {
//             return res.status(403).json({ error: 'You are not authorized to update this comment' });
//         }

//         // Update the comment text
//         comment.text = newText;
//         await comment.save();

//         return res.status(200).json({ success: true, comment });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// };

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        await comment.destroy();

        return res.status(200).json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { storeComment, deleteComment };
