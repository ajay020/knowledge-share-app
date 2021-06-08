const express = require('express');
const router = express.Router();
const passport = require('passport');
const {ensureAuth, validate} = require('../middleware/auth');
const userController = require('../controllers/userController');

//@desc regitster user
// GET /user/register
router.get('/register', userController.register_user_get);

//@desc regitster user
// POST /user/register
router.post('/register', 
    validate('registerUser'),
    userController.register_user_post
    );

//@desc login user
// GET /user/login
router.get('/login', userController.login_user_get);

//@desc login user
// POST /user/login
// passport.authenticate('local',{failureRedirect:"/auth/login",
    //  failureFlash:"invalid email/password"}) ,
router.post('/login', userController.login_user_post);

//@desc login user
// POST /user/logout
router.get('/logout',  userController.logout_user);

module.exports = router;
