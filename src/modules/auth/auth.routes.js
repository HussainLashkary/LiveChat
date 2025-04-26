const { Router } = require("express");
const { sendOtpHandler, checkOtpHandler } = require("./auth.controller");
const router = Router();

router.post("/sendOtp", sendOtpHandler);
router.post("/checkOtp", checkOtpHandler);
router.get("/login", (req, res) => {
    const message = req.session.message
    req.session.message = null;
    res.render("login", { message });
});

module.exports = {
    AuthRoutes: router
}