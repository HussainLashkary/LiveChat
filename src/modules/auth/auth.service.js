const createHttpError = require("http-errors");
const User = require("../user/userModel");
const jwt = require("jsonwebtoken");

async function sendOtp(mobile, fullName) {
    const user = await User.findOne({ mobile });
    const now = new Date().getTime();
    const otp = {
        code: Math.floor(Math.random() * 900000) + 100000,
        expiresIn: now + (1000 * 60 * 5)
    }
    if ( !user ) {   
        const newUser = await User.create({ mobile, fullName, otp });
        console.log(newUser.otp)
        return newUser
    }
    if (user.otp && user.otp.expiresIn > now) {
        return {
            user,
            otpCreated: false,
            message: "otp code not expired"
        }
    }
    user.otp = otp;
    console.log(user.otp)
    await user.save();
    return {
        user,
        message: "otp sent successfully",
        otpCreated: true
    };
}

async function checkOtp(mobile, code) {
    const user = await checkExist(mobile);
    const now = new Date().getTime();
    if (user?.otp?.expiresIn < now) throw new createHttpError.Unauthorized("otp code expired");
    if (user?.otp?.code !== code) throw new createHttpError.Unauthorized("otp code is incorrect");
    if (!user.verifiedMobile) {
        user.verifiedMobile = true;
    }
    const accessToken = await signToken({mobile, id: user._id});
    user.accessToken = accessToken;
    await user.save();
    return {accessToken, user}
}

async function checkExist(mobile) {
    const user = await User.findOne({mobile});
    if( !user ) throw new createHttpError.NotFound("user not found");
    return user;
}

function signToken(payload) {
    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: "1y"});
}


module.exports = {
    sendOtp,
    checkOtp
}