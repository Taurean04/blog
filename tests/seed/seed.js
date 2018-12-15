const {ObjectId} = require('mongodb'),
    jwt = require('jsonwebtoken'),
    {User} = require('../../api/models/UserModel');

const userOneId = new ObjectId(),
    userTwoId = new ObjectId();

const users = [
    {
        _id: userOneId,
        firstname: "Thierry",
        lastname: "Henry",
        email: "thierry@dev.com",
        password: "useronepass",
        blogPosts: [],
        tokens: [{
            access: 'auth',
            token: jwt.sign({
                _id:userOneId,
                access: 'auth'
            },
            process.env.SECRET).toString()
        }]
    },
    {
        _id: userTwoId,
        firstname: "Dennis",
        lastname: "Bergkamp",
        email: "dennis@dev.com",
        password: "usertwopass",
        blogPosts: [],
        tokens: [{
            access: 'auth',
            token: jwt.sign({
                _id:userTwoId,
                access: 'auth'
            },
            process.env.SECRET).toString()
        }]
    }
];

const populateUsers = (done => {
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo])
    }).then(() => done());
});

module.exports = {
    users,
    populateUsers
};