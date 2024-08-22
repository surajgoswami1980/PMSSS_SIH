const Listing = require("../models/listings.js");
const Review = require("../models/reviews.js");

module.exports.addReview=async (req, res, next)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author =req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review created Successfuly");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview= async (req, res,next) => {
    let { id ,reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("error"," Review deleted Successfuly");
    res.redirect(`/listings/${id}`);
  };