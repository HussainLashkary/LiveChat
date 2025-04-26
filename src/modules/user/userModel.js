const { Schema, model } = require("mongoose");

const OTPSchema = new Schema({
    code: {type: String, required: false, default: undefined},
    expiresIn: {type: Number, required: false, default: 0},
})
const UserSchema = new Schema({
    fullName: {
        type: String,
        required: false,
        minLength: 3,
        maxLength: 40
    },
    mobile: {
        type: String,
        unique: true,
        required: true,
        match: [/^09\d{9}$/,
            "Invalid Iranian phone number format"
        ]
    },
    otp: {type: OTPSchema},
    verifiedMobile: {type: Boolean, default: false, required: true},
    accessToken: {type: String},
}, {timestamps: true});
const User = model("User", UserSchema);

module.exports = User