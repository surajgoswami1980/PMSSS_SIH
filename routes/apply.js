const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");  // Utility for handling async errors
const Listing = require("../models/listings.js");    // Listing model
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); // Middleware functions
const applyController = require("../controllers/apply.js");  // Listing controller
const multer = require('multer');  // Middleware for handling file uploads
const { storage } = require("../cloudConfig.js");  // Cloud storage configuration for multer
const upload = multer({ storage }); // Allow up to 5 images

router.get("/apply", isLoggedIn,  wrapAsync(applyController.apply)); // apply Route
// router.post("/submit", isLoggedIn, upload.array("images", 5), wrapAsync(applyController.submitScholarship));
// router.post("/apply",isLoggedIn, upload.array("listing[images]",5), validateListing, wrapAsync(applyController.apply));

router.post("/submitpersonaldetails", isLoggedIn, wrapAsync(applyController.submitpersonaldetails));
router.post("/submitacedmicdetails", isLoggedIn, wrapAsync(applyController.submitacedmicdetails));
router.post("/submitbankdetails", isLoggedIn, wrapAsync(applyController.submitbankdetails));
router.post("/submitScholarship", isLoggedIn, upload.array("images", 7), wrapAsync(applyController.submitScholarship));
// router.post("/submitScholarship", isLoggedIn, upload.array("images", 7), wrapAsync(applyController.submitScholarship));
router.get("/:userId/trackapplication",isLoggedIn,wrapAsync(applyController.trackapplication));

router.get("/collegeverification", isLoggedIn,  wrapAsync(applyController.collegeverification)); // apply Route
router.get("/scholars/:scholarid/viewscholars", isLoggedIn,  wrapAsync(applyController.viewscholars)); // apply Route
router.post("/scholars/:id/update-status", isLoggedIn,  wrapAsync(applyController.updatestatus)); // apply Route
router.post('/scholars/:id/reject',isLoggedIn,  wrapAsync(applyController.rejectedstatus));
module.exports = router;