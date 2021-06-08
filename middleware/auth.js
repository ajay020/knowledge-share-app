const {body} = require('express-validator');

module.exports = {
    ensureAuth: (req, res, next)=>{
        if(req.isAuthenticated()){
            next();
        }else{
            res.redirect('/auth/login');
        }
    },
    validate :(method) =>{
        switch(method){
            case 'registerUser' : {
               return [
                    body('email', "Invalid email").isEmail(),
                    body('password',"password length must be at least 3").isLength({min:3})
                ]
            }
            case 'loginUser' : {
                return [
                    body('email', "Invalid email").isEmail(),
                    body('password',"password length must be at least 3").isLength({min:3})
                ]
            }
               
        }
    }
}

