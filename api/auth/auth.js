const {User} = require('../models/UserModel');
let authenticate = (req, res, next) => {
    let token = req.header('token');
    User.findByToken(token).then(user => {
        if(!user){
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch(e=>res.status(401).send('Invalid User'));
};

module.exports = {authenticate}