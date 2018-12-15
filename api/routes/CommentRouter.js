const express = require('express'),
    router = express.Router(),
    CommentController = require('../controllers/CommentController'),
    {authenticate} = require('../auth/auth');

router.route('/:id')
.post(authenticate, CommentController.addComment)
.get(authenticate, CommentController.getComment);
router.route('/post/:id').get(authenticate, CommentController.fetchCommentsByPost);
router.route('/user/:id').get(authenticate, CommentController.fetchCommentsByUser);
module.exports = router;