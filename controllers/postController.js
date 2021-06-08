const path = require('path');
const Post  = require('../models/Post');
const fs = require('fs');
const {v4: uuid} = require('uuid');

// Display create post form on GET
exports.add_post_get = (req, res) =>{
    res.render('posts/add', {auth: req.isAuthenticated()});
}

// Handle create post form on POST
exports.add_post_post = async (req, res) =>{
    let uploadPath;
    req.body.user = req.user.id;
    
    if (!req.files || Object.keys(req.files).length === 0) {
        console.log("No file uploaded.");
        //return res.status(400).send('No files were uploaded.');
    }
    if(req.files){
        const {image} = req.files;
        const uniqueId = uuid();
        uploadPath = path.dirname(__dirname)+ '/public/images/'+ uniqueId + path.extname(image.name);

        // Use the mv() method to place the file somewhere on server
        image.mv(uploadPath,  async(err) =>{
            if (err){
                return res.status(500).send(err);
            }
            
            console.log("File uploaded!", path.extname(image.name));
            await Post.create({...req.body, image:`/images/${uniqueId}${path.extname(image.name)}` }, function(err){
                if(err){
                    res.send(err);
                } else{
                    req.flash("success_msg","Post created successfully!");
                    res.redirect('/');
                }
            });
        })
    }else{
        await Post.create(req.body, function(err){
            if(err){
                res.send(err);
            } else{
                res.redirect('/');
            }
        });
    }

}

// Display a singe post detail
exports.post_detail = async(req, res) =>{
    try {
        let post = await Post.findById(req.params.postId).populate('user').lean();
        if(!post){
           return res.statusCode(404).json({mag:"Not found"});
        }
        res.render('posts/show', {post});

    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

//Display edit post form on GET
exports.edit_post_get = async (req, res)=>{
    try {
        // console.log('post', req.params.postId);
        let post = await Post.findOne({_id:req.params.postId}).lean();
        if(!post){
            res.send("not found");
        }
        // console.log('post', {title:post.title, body:post.body});
        res.render('posts/edit', {post,auth: req.isAuthenticated()});

    } catch (error) {
        console.error(error);
        res.sendStatus(500).send(error);
    }
}

// Handle edit post form on PUT
exports.edit_post_put =  async(req, res) =>{

    try {
        // console.log("user", req);
        let post = await Post.findOne({_id: req.params.postId}).lean();
        if(!post){
            res.render("error/404");
        }
        if(post.user != req.user.id){
            res.redirect('/');
        }else{
            if(req.files){
              const {image} = req.files;
              const uniqueId = uuid();
              let uploadPath = path.dirname(__dirname)+ '/public/images/' + uniqueId + path.extname(image.name);
              image.mv(uploadPath, async (err) =>{
                if(err){
                    console.log("couldn't upload file.");
                }
                req.body.image = `/images/${uniqueId}${path.extname(image.name)}`;
                await Post.findOneAndUpdate(
                    {_id:req.params.postId}, req.body,
                {new: false});
              });
            }else{
                await Post.findOneAndUpdate(
                    {_id:req.params.postId}, req.body,
                {new: true});
            }
            res.redirect('/');
        }
    } catch (error) {
        console.error(error);
        return res.render('error/500')   
    }
}

// Handle delete post
exports.delete_post = async(req, res)=>{
    try {
        // console.log("delete");
        const post  = await Post.findById(req.params.postId);
        if(req.user.id != post.user){
            res.redirect('/');
        }else{
            let image_path = path.dirname(__dirname) + "/public" + post.image;
            console.log(image_path);
            fs.unlink(image_path, async err =>{
                if(err){
                    console.log(err);
                }
                // console.log("Image deleted");
                await Post.findOneAndRemove({_id:req.params.postId}, async (err) =>{
                    if(err){
                        res.json({msg:"deletion failed!"});
                    }
                    req.flash("success_msg","Post deleted successfully!");
                    res.redirect('/');
                });
            })
        }
     
    } catch (error) {
        // console.error(error);
        res.statusCode(500).json(error);
    } 
 }

 //Display all post
 exports.post_list = async(req, res) =>{
    try {
        const posts = await Post.find({
              user: req.params.userId,
              status:'public'})
              .populate('user')
              .lean();
        console.log('posts', posts)    ;
        res.render('home', {posts, auth:req.isAuthenticated()});      

    } catch (error) {
        console.error(error);
        res.statusCode(500).json(error);
    }
}