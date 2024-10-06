const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError =require("../utils/ExpressError.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")
const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.signupForm)
.post( wrapAsync(userController.postSignUp));

router.route("/login")
.get(userController.loginForm)
.post( saveRedirectUrl ,passport.authenticate("local",{
    failureRedirect : "/login",
     failureFlash :true,
}), userController.postLogin);

router.get("/logout",userController.logout);  



// Verify OTP Route

router.route('/verify-otp')
  .get((req, res) => {
    res.render('users/verify-otp', { email: req.query.email });
  })
  .post(wrapAsync(userController.verifyOTP));


// Forgot Password
router.route('/forgot-password')
  .get(userController.forgotPasswordForm)
  .post(wrapAsync(userController.postForgotPassword));

// Verify OTP for Password Reset
router.route('/verify-reset-otp')
  .get(userController.verifyResetOTPForm)
  .post(wrapAsync(userController.postVerifyResetOTP));

// Reset Password
router.route('/reset-password/:token')
  .get(wrapAsync(userController.resetPasswordForm))
  .post(wrapAsync(userController.postResetPassword));

module.exports =router;