const express = require('express');
const router = express.Router();
const {ensureAuth} = require('../middleware/auth');
const post_controller = require('../controllers/postController');

//@desc add a new post
// GET /posts/add
router.get('/add',ensureAuth,  post_controller.add_post_get);

//@desc add a new post
// POST /posts/add
router.post('/', post_controller.add_post_post);

//@desc read single post
// GET /posts/postId
router.get('/:postId', post_controller.post_detail);

//Desc show edit page
// GET posts/update/postId
router.get('/update/:postId', post_controller.edit_post_get);

//Desc update post
// PUT posts/update/postId
router.put('/:postId',post_controller.edit_post_put);

//@Desc delete post
// DELETE posts/delete/:postId
router.delete('/delete/:postId',ensureAuth, post_controller.delete_post);

//@Desc get all posts of this user
// GET posts/user/:userId
router.get("/user/:userId", ensureAuth, post_controller.post_list);

module.exports = router;