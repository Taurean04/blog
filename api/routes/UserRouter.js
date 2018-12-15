const express = require('express'),
    router = express.Router(),
    UserController = require('../controllers/UserController'),
    {authenticate} = require('../auth/auth');

router.route('/register').post(UserController.addUser);
router.route('/login').post(UserController.loginUser);
router.route('/:id')
    .get(authenticate, UserController.getUser)
    .put(authenticate, UserController.updateUser)
    .delete(authenticate, UserController.deleteUser);
router.route('/').get(authenticate, UserController.getUsers);
module.exports = router;