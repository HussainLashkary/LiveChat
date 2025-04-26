const User = require("../modules/user/userModel");
const jwt = require("jsonwebtoken")

require("dotenv").config();

async function checkAuth(req, res, next) {
    const userToken = req?.cookies?.access_token;
    //check if there is token if not redirect it to login page
    if ( !userToken ) {
        req.session.message = "login to your account"
        return res.redirect("/auth/login")
    }
    try {
        const verified = jwt.verify(userToken, process.env.SECRET_KEY);
        if( verified?.mobile ) {
            const mobile = verified.mobile;
            const user = await User.findOne({ mobile });
            if( !user ) {
                req.session.message = "login or register";
                return res.redirect("/auth/login");
            }
            req.session.user = user;
        }
        next();
    } catch (error) {
        console.log("Authentication error", error);
        req.session.message = "Invalid authentication";
        return res.redirect("auth/login");
    }
}

module.exports = {
    checkAuth
}