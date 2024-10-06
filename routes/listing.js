const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");  // Utility for handling async errors
const Listing = require("../models/listings.js");    // Listing model
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); // Middleware functions
const listingController = require("../controllers/listing.js");  // Listing controller
const multer = require('multer');  // Middleware for handling file uploads
const { storage } = require("../cloudConfig.js");  // Cloud storage configuration for multer
const upload = multer({ storage }); // Allow up to 5 images


// Routes

router.route("/")
    .get(wrapAsync(listingController.index)) // Index Route
    .post(isLoggedIn, upload.array("listing[images]",5), validateListing, wrapAsync(listingController.create));  // Create Route with multiple image upload support

router.get("/:currUser/youritems", isLoggedIn, wrapAsync(listingController.youritems)); // Your items route after login
router.get("/:id/SellerItems", wrapAsync(listingController.SellerItems)); // Seller items route

router.get("/new", isLoggedIn, wrapAsync(listingController.new)); // New Route
// router.get("/apply", isLoggedIn, listingController.apply); // apply Route

router.route("/:id")
    .get(wrapAsync(listingController.show)) // Show Route
    .put(isLoggedIn, isOwner, upload.array("listing[images]",5), validateListing, wrapAsync(listingController.update)) // Update Route with multiple image upload support
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete)); // Delete Route

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit)); // Edit Route

router.get('/category/:category', wrapAsync(listingController.filterByCategory)); // Filter by category route

// Profile Routes
router.get("/:listingownerid/listingsownerprofile", wrapAsync(listingController.listingsownerprofile)); 
router.get("/:userId/profile", isLoggedIn, wrapAsync(listingController.showProfile));
router.get("/:userId/profile/edit", isLoggedIn, upload.single("user[image]"), wrapAsync(listingController.editProfile));
router.put("/:userId/profile/update", isLoggedIn, upload.single("user[image]"), wrapAsync(listingController.updateProfile));
router.get("/:userId/profile/delete", isLoggedIn, wrapAsync(listingController.deleteProfile));

module.exports = router;
