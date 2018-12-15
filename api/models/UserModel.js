const mongoose = require('mongoose'),
    validator = require('validator'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcryptjs'),
    _ = require('lodash');

const UserSchema =  new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minlength: 2
    },
    lastname: {
        type: String,
        required: true,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens:[{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    blogPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blogPost'
    }],
    createdAt: {
        type: Date,
        default: new Date().toString()
    }
});
UserSchema.methods.toJSON = function(){
    let user = this,
    userObject = user.toObject();
    return _.pick(userObject, ['_id', 'firstname', 'lastname', 'email', 'blogPosts', 'createdAt']);
};
UserSchema.methods.generateAuthToken = function(){
    let user = this,
        access = 'auth',
        token = jwt.sign({
            _id: user._id.toHexString(),
            access
        },
        process.env.SECRET).toString();
    user.tokens.push({
        access,
        token
    });
    return user.save().then(() => token);
};

UserSchema.statics.findByToken = function(token){
    let User = this,
        decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET);
        } catch (e) {
            return Promise.reject();
        }
    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

// For login
UserSchema.statics.checkLogin = function(email, password){
    let User = this;
    return User.findOne({
        email
    }).then(user => {
        if(!user){
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res){
                    resolve(user);
                }else{
                    reject();
                };
            });
        });
    });
};

UserSchema.virtual('postCount').get(function(){
    let user = this;
    return user.blogPosts.length;
});

UserSchema.pre('save', function(next){
    let user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    }else{
        next();
    }
});

UserSchema.pre('remove', function(next){
    let User = this;
    const BlogPost = mongoose.modelNames('blogPost');
    BlogPost.remove({
        _id: {
            $in: User.blogPosts
        }
    }).then(() => next());
});
const User = mongoose.model('user', UserSchema);
module.exports = {User};