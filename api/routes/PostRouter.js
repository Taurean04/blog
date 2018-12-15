const express = require('express'),
    router = express.Router(),
    PostController = require('../controllers/PostController'),
    {authenticate} = require('../auth/auth');

router.route('/')
.post(authenticate, PostController.addPost)
.get(authenticate, PostController.fetchPosts);
router.route('/:id')
.get(authenticate, PostController.getPost)
.put(authenticate, PostController.updatePost)
.delete(authenticate, PostController.deletePost);
module.exports = router;