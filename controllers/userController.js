const fs = require('fs');
const path = require('path');
const {v4: uuid} = require('uuid');
const passport = require('passport');

const { validationResult} = require('express-validator');
const User = require('../models/User');
const Post = require('../models/Post');

exports.register_user_get = (req, res)=>{
    res.render('register', {title:"Register"});
};

exports.register_user_post = async(req, res)=>{
    
    try {
        const errors = validationResult(req);
    if(!errors.isEmpty()){
        // res.status(422).json({ errors: errors.array() });
        console.log(errors);
       return res.render('register', {errors : errors.array()});
    }

    let user = new User(req.body);
    let dbUser = await User.findOne({email:user.email}).lean();
    if(dbUser){
        console.log("user already exists!");
        req.flash('error', 'User already exists!');
        return res.redirect('register');
    }
    // console.log("files",req.files);
    let uploadPath;

    if(req.files){
        const {profile} = req.files;
        const uniqueId = uuid();
        uploadPath = path.dirname(__dirname)+ '/public/images/profile_pics/'+ uniqueId + path.extname(profile.name);

        // Use the mv() method to place the file somewhere on server
        profile.mv(uploadPath,  async(err) =>{
            if (err){
                return res.status(500).send(err);
            }
            user.profile = `/images/profile_pics/${uniqueId}${path.extname(profile.name)}`;
            console.log("File uploaded!", user);

            user.save(user, function(err, user){
                if(err){
                    console.log(err);
                    res.send(err);
                }
                console.log(user);

                req.flash('success_msg', 'Register successfully!');
                res.redirect('/');
            })
        })
    }else{
        user.save(user, function(err, user){
            if(err){
                console.log(err);
                res.send(err);
            }
            req.flash('success_msg', 'Register successfully!');
            res.redirect('/');
        })
    }
    } catch (error) {
        console.log(error);
        return res.render('error/500')   
    }
}

exports.login_user_get = (req, res) =>{
    if(req.isAuthenticated()){
      res.redirect('/');
    }
    else{
      res.render('login');  
    }
}

// exports.login_user_post = (req, res) =>{
//     const errors = validationResult(req);
//     console.log(errors);
//     if(!errors.isEmpty()){
//        console.log("Login error",errors);
//        return res.render('login', {errors : errors.array()});
//     }

//     req.flash('success_msg', "Login successfully!");
//     res.redirect('/');
// }
exports.login_user_post = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
   
      if (err) { return next(err); }
      if (!user) { 
         req.flash('error', "Invalid Email/Password!");
          return res.redirect('/auth/login'); 
        }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        req.flash('success_msg', "Login successfully!");
        return res.redirect('/');
      });
    })(req, res, next);
  }

exports.logout_user = (req, res) =>{
    req.logout();
    req.flash('success_msg', "Logout! You can login again.");
    res.redirect('/auth/login');
}

exports.edit_profile_get = async(req, res) =>{
    const userId = req.params.userId;
    let user = await User.findById(userId).lean();
    // console.log(user);

    res.render('user/edit_profile', {user, auth: req.isAuthenticated()});
}
exports.edit_profile_put = async(req, res) =>{
    try {
        let user = await User.findById(req.params.userId).lean();
        if(!user){
            res.render("error/404");
        }
        if(req.user.id != user._id){
            res.redirect('/');
        }else{
            if(req.files){
                const {profile} = req.files;
                const uniqueId = uuid();
                let uploadPath = path.dirname(__dirname)+ '/public/images/profile_pics/' + uniqueId + path.extname(profile.name);
                profile.mv(uploadPath, async (err) =>{
                  if(err){
                      console.log("couldn't upload file.");
                  }
                  req.body.profile = `/images/profile_pics/${uniqueId}${path.extname(profile.name)}`;
                  await User.findOneAndUpdate(
                      {_id:req.params.userId}, req.body,
                  {new: false});
                });
              }else{
                // console.log("body =>",req.body);
                  await User.findOneAndUpdate(
                      {_id:req.params.userId}, req.body,
                  {new: true});
              }
              req.flash("success_msg","profile edited successfully!");
              res.redirect('/');
        }
    } catch (error) {
        console.error("err =>",error);
        return res.render('error/500')   
    }
    
}

exports.delete_user = async(req, res) =>{
    console.log("Delete account");
    try {
        const user  = await User.findById(req.params.userId);
        if(req.user.id != user._id){
            res.redirect('/');
        }else{
            let profile_path = path.dirname(__dirname) + "/public/" + user.profile;
            console.log(profile_path);
            fs.unlink(profile_path, async err =>{
                if(err){
                    console.log("Couldn't delete user profile.");
                    console.log(err);
                }
                // console.log("Image deleted");
                await Post.remove({user: req.params.userId});
                await User.findOneAndRemove({_id:req.params.userId}, async (err) =>{
                    if(err){
                        res.json({msg:"deletion failed!"});
                    }
                    req.flash("success_msg","User account deleted!!");
                    res.redirect('/');
                });
            })
        }
     
    } catch (error) {
        // console.error(error);
        res.statusCode(500).json(error);
    } 
}

exports.details_user = async(req, res) =>{
    try {
        const userId = req.params.userId;
        const posts = await Post.find({user: userId}).populate('user').lean();
        if(!posts){
            console.log("No post found");
        }
        const user = await User.findById(userId).lean();
        // console.log(user);
        res.render('user/user_details', {posts,user, auth:req.isAuthenticated()});
    } catch (error) {
        console.log(error);
        res.render('error/500');
    }
}