const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const Listing = require("./listings");
const Review = require("./reviews.js");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true ,
    },
    username: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        // required: true,
    },
    address: {
        type: String,
    },
    image: {
        url: String,
        filename: String,
    },
    otp:{
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false // Default to false since new users are not verified
    },
    resetOTP: {
        type: String,
    },
    resetOTPExpiration: {
        type: Date,
    },
    role: {
        type: String,
        enum: ["student", "college", "bank", "admin"], // Defining allowed roles
        required: true, // Ensure a role is always provided
    }
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

// Middleware to delete listings and reviews when a user is deleted

userSchema.pre("findOneAndDelete", async function (next) {
    try {
        const user = await this.model.findOne(this.getQuery());
        if (user) {
            // Find all listings by the user
            const listings = await Listing.find({ owner: user._id });
            
            for (const listing of listings) {
                // Delete all reviews associated with the user's listings
                await Review.deleteMany({ _id: { $in: listing.reviews } });
                
                // Clear the reviews array in the listing document
                listing.reviews = [];
                await listing.save();
                
                // Delete the listing itself
                await Listing.findByIdAndDelete(listing._id);
            }

            // Find reviews by the user in other listings
            const reviews = await Review.find({ author: user._id });

            for (const review of reviews) {
                // Remove the review reference from the corresponding listing
                await Listing.updateMany(
                    { reviews: review._id },
                    { $pull: { reviews: review._id } }
                );
                // Delete the review itself
                await Review.findByIdAndDelete(review._id);
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});


module.exports = mongoose.model("User", userSchema);
