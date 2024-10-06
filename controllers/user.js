const crypto = require('crypto');
const Listing = require("../models/listings.js");
const nodemailer = require('nodemailer');
const User = require('../models/user'); // Adjust the path if necessary
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } = process.env;
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: process.env.EMAIL_PORT === '465', // Use TLS
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// Generate OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// Render Sign-Up Form
exports.signupForm = (req, res) => {
  res.render('users/signup.ejs');
};

// Sign-Up with OTP

exports.postSignUp = async (req, res) => {
    try {
      const { username, email, password ,role ,phone} = req.body;
  
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        if (user.isVerified) {
          req.flash('error', 'This email is already registered and verified.');
          return res.redirect('/signup');
        } else {
          // Resend OTP if user is not verified
          const otp = generateOTP();
          user.otp = otp;
          await user.save();
  
          // Resend OTP via email
          const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`
          };
  
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending OTP:', error);
              return req.flash('error', 'Error in sending message.');
            }
            res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
          });
          return;
        }
      }
  
      // Create a new user
      user = new User({ email, username,role,phone, isVerified: false });
      await User.register(user, password);
  
      // Generate OTP
      const otp = generateOTP();
      user.otp = otp;
      await user.save();
  
      // Send OTP via email
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending OTP:', error);
          return req.flash('error', 'Error in sending message.');
        }
        res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
      });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/signup');
    }
  };
  
  // Verify OTP
// Verify OTP
exports.verifyOTP = async (req, res, next) => {
    try {
      const { email, otp } = req.body;
      console.log('Email:', email);
      console.log('Entered OTP:', otp);
  
      // Fetch user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        console.log('User not found');
        req.flash('error', 'User not found.');
        return res.redirect('/verify-otp?email=' + encodeURIComponent(email));
      }
  
      console.log('Stored OTP:', user.otp);
  
      // Check if OTP matches
      if (user.otp !== otp) {
        console.log('OTP does not match');
        req.flash('error', 'INVALID OTP');
        return res.redirect('/verify-otp?email=' + encodeURIComponent(email));
      }
  
      // Mark user as verified and clear the OTP
      user.isVerified = true;
      user.otp = null; // Clear OTP
      await user.save();
  
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        req.flash('success', 'Email verified successfully');
        res.redirect('/listings');
      });
    } catch (error) {
      console.error('Error during OTP verification:', error);
      next(error);
    }
  };
  
  
  

// Login Form
exports.loginForm = (req, res) => {
  res.render('users/login.ejs');
};

// Post Login
exports.postLogin = async (req, res) => {
  req.flash('success', 'Welcome back');
  let redirectUrl = res.locals.redirectUrl || '/listings';
  res.redirect(redirectUrl);
};

// Logout
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('error', 'You are logged out!');
    res.redirect('/listings');
  });
};


// Render Forgot Password Form
exports.forgotPasswordForm = (req, res) => {
  res.render('users/forgot-password.ejs');
};

// Handle Forgot Password Request
exports.postForgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    req.flash('error', 'No account with that email found.');
    return res.redirect('/forgot-password');
  }

  // Generate Reset OTP and Expiration
  const resetOTP = generateOTP();
  user.resetOTP = resetOTP;
  user.resetOTPExpiration = Date.now() + 3600000; // 1 hour expiration

  await user.save();

  // Send OTP via email
  const mailOptions = {
    from: EMAIL_FROM,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your password reset OTP code is ${resetOTP}. This code is valid for 1 hour.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending OTP:', error);
      req.flash('error', 'Error sending OTP. Please try again.');
      return res.redirect('/forgot-password');
    }
    res.redirect(`/verify-reset-otp?email=${encodeURIComponent(email)}`);
  });
};

// Render Verify Reset OTP Form
exports.verifyResetOTPForm = (req, res) => {
  res.render('users/verify-reset-otp.ejs', { email: req.query.email });
};

// Handle OTP Verification for Password Reset
exports.postVerifyResetOTP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email, resetOTP: otp, resetOTPExpiration: { $gt: Date.now() } });

  if (!user) {
    req.flash('error', 'Invalid or expired OTP.');
    return res.redirect(`/verify-reset-otp?email=${encodeURIComponent(email)}`);
  }

  req.flash('success', 'OTP verified successfully. You can now reset your password.');
  res.redirect(`/reset-password/${otp}`);
};

// Render Reset Password Form
exports.resetPasswordForm = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ resetOTP: token, resetOTPExpiration: { $gt: Date.now() } });

  if (!user) {
    req.flash('error', 'Invalid or expired reset token.');
    return res.redirect('/forgot-password');
  }

  res.render('users/reset-password.ejs', { token });
};

// Handle Reset Password Request
// Handle Reset Password Request
exports.postResetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  
  try {
    // Find the user based on the reset OTP and ensure the token is not expired
    const user = await User.findOne({ resetOTP: token, resetOTPExpiration: { $gt: Date.now() } });

    if (!user) {
      req.flash('error', 'Invalid or expired reset token.');
      return res.redirect('/forgot-password');
    }

    // Use Passport's setPassword method to hash the new password
    await user.setPassword(password);

    // Clear the reset token and expiration from the database
    user.resetOTP = null;
    user.resetOTPExpiration = null;

    // Save the updated user object
    await user.save();

    req.flash('success', 'Password has been reset successfully.');
    res.redirect('/login');
  } catch (error) {
    console.error('Error during password reset:', error);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/forgot-password');
  }
};

