const express = require('express');
const router = express.Router();
const Post = require('../models/Post');


//@desc Home page
// GET /
router.get('/', async function(req, res){
   try {
      const posts = await Post.find().populate('user').lean();
      let userId = null;
      if(req.user){
           userId = req.user._id;
      }
      res.render('home', {
           posts,
           auth:req.isAuthenticated(),
           userId,
        });
   } catch (error) {
        console.log(error);
        res.render('error/500');
   }
});

module.exports = router;