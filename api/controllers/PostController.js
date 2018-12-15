const {User} = require('../models/UserModel'),
    {Post} = require('../models/PostModel');

exports.addPost = function(req, res){
    let author = req.user._id;
    req.body.author = author;
    let post = new Post(req.body);
    post.save().then(() => {
        User.findById(author).then(user => {
            user.blogPosts.push(post);
            user.save();
        }).then(() => res.status(200).send({post}));
    }).catch(e => res.status(400).send(e));
};

exports.getPost = function(req,res){
    let postId = req.params.id;

    Post.findById(postId)
    .populate('author')
    .populate('comments')
    .then(post => {
        if(!post){
            return res.status(404).send('No post found');
        }
        res.status(200).send({post});
    }).catch(e => res.status(400).send(e))
};

exports.fetchPosts = function(req, res){
    let author = req.user._id;
    Post.find({author})
    .populate('author')
    .populate('comments')
    .then(posts => {
        if(!posts) {
            return res.status(404).send('No posts');
        }
        res.status(200).send({posts});
    }).catch(e => res.status(400).send(e));
};

exports.updatePost = function(req, res){
    let postId = req.params.id;
    let data = req.body;
    Post.findByIdAndUpdate(
        {_id: postId},
        {$set: data},
        {new:true}
    ).then(post => {
        if(!post) return res.status(404).send("No post found");
        res.status(200).send({post});
    }).catch(e => res.status(400).send(e));
}

exports.deletePost = function(req, res){
    let postId = req.params.id;
    Post.findByIdAndRemove(postId).then(post => {
        if(!post) return res.status(404).send('Unable to find post');
        res.status(200).send({post});
    }).catch(e => res.status(400).send(e));
};