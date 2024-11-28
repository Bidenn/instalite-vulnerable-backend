const express = require('express');
const { storePost, deletePost, getPostDetails } = require('../controllers/postController');

const router = express.Router();

router.post('/store', storePost);
router.delete('/:postId', deletePost);
router.get('/:postId', getPostDetails);

module.exports = router;
