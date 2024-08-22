const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync =require("../utils/wrapAsync.js");
const ExpressError =require("../utils/ExpressError.js");
const Listing = require("../models/listings.js");
const Review = require("../models/reviews.js");
const {validateReview, isLoggedIn ,isReviewAuthor,isLoggedIn1} = require("../middleware.js");
const reviewController = require("../controllers/review.js");



router.post("/",isLoggedIn1,isLoggedIn ,validateReview ,wrapAsync(reviewController.addReview));

// Reviews Post Route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview ));
module.exports = router;