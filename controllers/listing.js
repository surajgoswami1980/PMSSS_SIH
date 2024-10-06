const Listing = require("../models/listings.js");
const user = require("../models/user");
const cloudinary = require('cloudinary').v2;
// const User = require("../models/user.js");
const User = require("../models/user"); // Import User model

module.exports.index=
    async (req, res,next) => {
  
        const allListings = await Listing.find({});
    
        res.render("listings/index.ejs", { allListings });
 };


// Controller for filtering listings by category
module.exports.filterByCategory = async (req, res, next) => {
    const { category } = req.params; // Get category from route parameter
    try {
        const filteredListings = await Listing.find({ category: category });
        if (filteredListings.length === 0) {
            req.flash('error', 'No records found in this category.');
            return res.redirect('/listings');
        }
        res.render('listings/index.ejs', { allListings: filteredListings });
    } catch (error) {
        next(error);
    }
};

module.exports.new= async (req, res,next) => {

    res.render("listings/new.ejs");
  };  

  module.exports.youritems = async (req, res, next) => {
    const ownerId = req.user._id; // Get the current user's ID
    // const {id}=req.params;
    const listings = await Listing.find({ owner: ownerId }).populate({ 
        path: "reviews",
        populate: {
            path: "author",
        },
    }).populate("owner");

    if (!listings.length) {
        req.flash("error", "You have no listings at the moment.");
        return res.redirect("/listings");
    }

    res.render("listings/youritem.ejs", { listings  });
};

module.exports.SellerItems = async (req, res, next) => {
  const { id } = req.params; // Get the clicked listing's ID
  try {
      // Find the listing by its ID to get the owner
      const listing = await Listing.findById(id).populate("owner");
      
      if (!listing) {
          req.flash("error", "Listing not found.");
          return res.redirect("/listings");
      }

      // Find all listings by the same owner
      const listings = await Listing.find({ owner: listing.owner._id }).populate({ 
          path: "reviews",
          populate: {
              path: "author",
          },
      }).populate("owner");

      if (!listings.length) {
          req.flash("error", "No listings found for this seller.");
          return res.redirect("/listings");
      }

      res.render("listings/youritem.ejs", { listings });
  } catch (error) {
      next(error);
  }
};





module.exports.show= async (req, res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ 
                                       path : "reviews",
                                      populate:{
                                        path:"author",
                                      },
                                    }).populate("owner");
    if (!listing) {
      req.flash("error", "This listing is not exist now");
       res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  };

  module.exports.create = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.files && req.files.length > 0) {
        newListing.images = req.files.map(file => ({
            url: file.path,
            filename: file.filename
        }));
    }

    await newListing.save();
    req.flash("success", "New Listing Added");
    res.redirect("/listings");
};


module.exports.edit = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "This listing does not exist");
        return res.redirect("/listings");
    }

    // Ensure listing.images is an array of image URLs
    let originalImageUrls = listing.images.map(image => {
        // Handle the case where image might be an object with a url property
        let url = (typeof image === 'string') ? image : image.url;
        return url.replace("/uploads", "/uploads/h-250,w-250");
    });

    res.render("listings/edit.ejs", { listing, originalImageUrls });
};





module.exports.update = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.files && req.files.length > 0) {
    const newImages = req.files.map(file => ({
      url: file.path,
      filename: file.filename
    }));
    listing.images.push(...newImages);
  }

  // Delete old images from Cloudinary
  if (listing.images && listing.images.length > 0) {
    listing.images.forEach(async (image) => {
      // Assuming image.filename is the public ID in Cloudinary
      cloudinary.uploader.destroy(image.filename, (error, result) => {
        if (error) {
          console.error('Failed to delete old image:', error);
        } else {
          console.log('Successfully deleted old image:', result);
        }
      });
    });
  }

  await listing.save();
  req.flash("success", "Updated Successfully");
  res.redirect(`/listings/${id}`);
};



module.exports.delete= async (req, res,next) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("error","deleted Successfuly");
    res.redirect("/listings");
  };

  
 // profile-- to looged in ------------------

 module.exports.showProfile = async (req, res, next) => {
  const userId = req.user._id; // Get user ID from route parameters

    try {
        // Fetch the user based on ID
         const user = await User.findById(userId );

        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/listings");
        }

        // Render profile view with user's data
        res.render("profile/show.ejs", { user });
    } catch (error) {
        next(error);
    }
};

// show profile to all people 
module.exports.listingsownerprofile = async (req, res,next) => {
  let {listingownerid}  = req.params;

    // Find the owner using the listings' owner ID
    const user = await User.findById(listingownerid);

    if (!user) {
      req.flash("error", "This user does not exist.");
      return res.redirect("/listings");
    }

    // Render the profile view with the user's data and their listings
    res.render("profile/show.ejs", { user});
  } ;

  // edit profile 
  module.exports.editProfile = async (req, res, next) => {
    const userId = req.user._id; // Get user ID from route parameters
    try {
        // Fetch the user based on ID
        const user = await User.findById(userId);
        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/listings");
        }

        let originalImageUrl = user.image?.url || "";
        if (originalImageUrl) {
            originalImageUrl = originalImageUrl.replace("/uploads", "/uploads/h-250,w-250");
        }

        // Render profile view with user's data
        res.render("profile/edit.ejs", { user, originalImageUrl });
    } catch (error) {
        next(error);
    }
};
        
  
  // update

  module.exports.updateProfile = async (req, res, next) => {
     const userId = req.user._id;
    
    let user =await User.findByIdAndUpdate(userId, { ...req.body.user });
    try {
        // const updatedData = { ...req.body };
        if(req.file){
          let url=req.file.path;
          let filename = req.file.filename;
          user.image ={url,filename};
          
        }
        console.log(req.file);
        await user.save();
       
        req.flash("success", "Profile updated successfully");
        res.redirect(`/listings/${userId}/profile`);
    } catch (error) {
        next(error);
    }
};
         

// deleted lists
module.exports.deleteProfile = async (req, res, next) => {
  const userId = req.user._id;  // Assume `id` is the user's ID

try {
    await User.findOneAndDelete({ _id: userId });
    req.flash("success", "User and all associated data deleted successfully.");
    res.redirect("/listings");
} catch (error) {
    req.flash("error", "Something went wrong.");
    res.redirect("/listings");
}
};

 