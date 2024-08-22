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

module.exports =router;