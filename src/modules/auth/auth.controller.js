const { inputsValidation } = require("../../validation/validation");
const {sendOtp, checkOtp} = require("./auth.service")
const sanitize = require("validator").escape;
//send otp function
async function sendOtpHandler(req, res, next) {
    try {
        //his ensures fullName holds the cleaned input, preventing potential security risks.
        req.body.fullName = sanitize(req.body.fullName);

        const {mobile, fullName} = req.body;

        //this check if user enter correct inputs format and does not contain anything harmful
        const validationResult = inputsValidation(fullName, mobile);

        if (validationResult !== true) {
            req.session.message = validationResult.message;
            return res.redirect("/auth/login");
        }

        //call middleware and pass data from body
        const result = await sendOtp(mobile, fullName);
        req.session.user = result.user;

        //related to otp not expired err handling in middleware check that
        if(!result.otpCreated) {
            return res.render("otp", {
                errorMessage: result.message,
                user: req.session.user,
                message: null
            })
        }
        //save user in session and render otp page and pass it message for success and put
        //errorMessage null if you dont put that it will return err says that errorMessage not defined
        res.render("otp", {
             message: result.message,
             user: req.session.user,
             errorMessage: null
            }
        );

    } catch (error) {
        next(error)
    }
}

async function checkOtpHandler(req, res, next) {
    try {
        const {mobile, code} = req.body;
        const token = await checkOtp(mobile, code);
        
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000 //1hour
        });

        return res.redirect("/chat")
    } catch (error) {
        if ( error ) {
            return res.render("otp", {
                user: req.session.user || {},
                errorMessage: error?.message || null
            })
        }

        next(error)
    }
}

module.exports = {
    sendOtpHandler,
    checkOtpHandler
}