const express = require('express');
const { storePost, deletePost, detailPost } = require('../controllers/postController');
const { toggleLikePost } = require('../controllers/likeController');
const { storeComment, deleteComment } = require('../controllers/commentController');
const router = express.Router();
const { upload } = require('../middlewares/uploadPost');

router.get('/:postId', detailPost);
router.post('/store', upload.single('content'), storePost);
router.delete('/:postId', deletePost);

router.post('/toggle-like', toggleLikePost);

router.post('/:postId/comment', storeComment); 
router.delete('/comment/:commentId', deleteComment); 

module.exports = router;
