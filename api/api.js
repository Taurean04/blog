const express = require('express'),
    api = express.Router(),
    UserRouter = require('./routes/UserRouter'),
    PostRouter = require('./routes/PostRouter'),
    CommentRouter = require('./routes/CommentRouter');

api.use('/users', UserRouter);
api.use('/posts', PostRouter);
api.use('/comments', CommentRouter);
module.exports = api;