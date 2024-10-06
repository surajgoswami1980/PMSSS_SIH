const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews");

// Define the image schema
const imageSchema = new Schema({
  url: String,
  filename: String,
});

// Define the listing schema
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  images: [imageSchema],  // Array of images using the imageSchema
  price: Number,
  location: String,
  country: String,
  category: String, 
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  address: {
    type: String,
  },
  createdAt1: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to delete related reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
    console.log("Deleted related reviews.");
  }
});

// Create and export the Listing model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
