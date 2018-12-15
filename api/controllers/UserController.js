const {User} = require('../models/UserModel');
exports.addUser = function(req,res){
    let data = req.body;
    let user = new User(data);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then(token => {
        res.header('auth', token).send({user});
    }).catch(err => {
        res.status(400).send(err);
    });
};

exports.loginUser = function(req, res){
    User.checkLogin(req.body.email, req.body.password).then(user => {
        return user.generateAuthToken().then(token => {
            res.header('auth', token).send({user});
        }).catch(e => res.status(400).send('Invalid Email and/or Password'));
    })
}

exports.getUser = function(req, res){
    let id = req.params.id;

    User.findById(id)
    .populate('blogPosts')
    .then(user => {
        if(!user){
            return res.status(404).send('User not found');
        }
        res.status(200).send({user});
    }).catch(e => res.status(400).send(`Unable to get user ${e}`));
}

exports.getUsers = function(req, res){
    User.find({}).populate('blogPosts')
    .then(users => {
        if(!users) {
            return res.status(404).send('No users');
        }
        res.status(200).send({users});
    }).catch(e => res.status(400).send(`Unable to get users ${e}`));
};
exports.updateUser = function(req, res){
    let userId = req.params.id;
    let data = req.body;
    User.findByIdAndUpdate({
        _id: userId
    }, {
        $set: data
    }, {
        new: true
    }).then(user => {
        if(!user) {
            return res.status(404).send('Unable to update user');
        }
        res.status(200).send({user});
    }).catch(e => res.status(400).send(e));
};

exports.deleteUser= function(req, res){
    let userId = req.params.id;
    User.findByIdAndRemove(userId).then(user => {
        if(!user) return res.status(404).send('Unable to find user');
        res.status(200).send({user});
    }).catch(e => res.status(400).send(e));
}