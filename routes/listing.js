const express = require("express");
const router = express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const { isLoggedIn, isOwner ,validateListing } = require("../middleware.js"); 
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

// router route
router.route("/")
    .get(wrapAsync(listingController.index)) // Index Route
    .post(isLoggedIn,upload.single("listing[image]"), validateListing, wrapAsync(listingController.create));  // Create Route


router.get("/new", isLoggedIn, wrapAsync(listingController.new)); // New Route
router.route("/:id")
    .get(wrapAsync(listingController.show)) // Show Route
    .put(isLoggedIn, isOwner, upload.single("listing[image]") , validateListing, wrapAsync(listingController.update))  // Update Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));  // Delete Route


router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit)); // Edit Route

module.exports = router;