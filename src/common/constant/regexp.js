const iranMobile = /^09\d{9}$/;
const nameRegex = /^(?=.*[a-zA-Z\u0600-\u06FF])[a-zA-Z0-9\u0600-\u06FF\s]{3,50}$/;

module.exports = {
    iranMobile,
    nameRegex
}