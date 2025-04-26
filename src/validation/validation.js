const { iranMobile, nameRegex } = require("../common/constant/regexp");
function inputsValidation(name, mobile) {
    if (!name || !mobile) {
        return {
            message: "mobile and name required"
        }
    }
    if (!iranMobile.test(mobile)) {
        return {
            message: "Invalid phone number format"
        }
    }
    if (!nameRegex.test(name) ) {
        return {
            message: "invalid name format"
        }
    }

    return true;
}

module.exports = {
    inputsValidation
}