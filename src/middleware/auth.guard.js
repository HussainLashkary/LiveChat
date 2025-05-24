const User = require("../modules/user/userModel");

require("dotenv").config();

async function checkAuth(req, res, next) {
    try {
        const userToken = req?.cookies?.access_token;
        //check if there is token if not redirect it to login page
        if ( !userToken ) {
            req.session.message = "login to your account"
            return res.redirect("/auth/login")
        }
        const user = await User.findOne({ accessToken: userToken });
        if( !user ) {
            req.session.message = "login or register";
            return res.redirect("/auth/login");
        }
        req.session.user = user;
        next();
    } catch (error) {
        console.log("Authentication error", error);
        req.session.message = "Invalid authentication";
        return res.redirect("auth/login");
    }
}

//do not let loged in user's access login route
async function checkAccessLogin(req, res, next) {
    try {
        const userToken = req?.cookies?.access_token;
        if ( userToken ) {
            const user = await User.findOne({ accessToken: userToken });
            if( user ) {
                return res.redirect("/chat");
            }
        }
        return next();
    } catch (error) {
        console.log("Authentication error", error);
        req.session.message = "Invalid authentication";
        return res.redirect("auth/login");
    }
}



module.exports = {
    checkAuth,
    checkAccessLogin
}