const express = require('express');
const router = express.Router();

const {ensureAuth} = require('../middleware/auth');
const userController = require('../controllers/userController');

router.get('/edit_profile/:userId', ensureAuth, userController.edit_profile_get);
router.put('/edit_profile/:userId',ensureAuth, userController.edit_profile_put);
router.delete('/delete/:userId', userController.delete_user);


module.exports = router;