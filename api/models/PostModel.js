const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true
    },
    content: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
    }],
});
const Post = mongoose.model('blogPost', PostSchema);
module.exports = {Post};