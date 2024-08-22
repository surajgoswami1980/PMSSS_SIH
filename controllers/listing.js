const Listing = require("../models/listings.js");

module.exports.index=
    async (req, res,next) => {
  
        const allListings = await Listing.find({});
    
        res.render("listings/index.ejs", { allListings });
 };

module.exports.new= async (req, res,next) => {

    res.render("listings/new.ejs");
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

module.exports.create=async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    let url=req.file.path;
    let filename = req.file.filename;
    newListing.owner = req.user._id;
    newListing.image = {url , filename};
    await newListing.save();
    req.flash("success", "New Listing Added");
    res.redirect("/listings");
  };

module.exports.edit=async (req, res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
 if(!listing){
  req.flash("error", "This listing is not exist now");
  res.redirect("/listings");
 }
 let originalImageUrl=listing.image.url;
 originalImageUrl=originalImageUrl.replace("/uploads","/uploads/h-250,w-250");
    res.render("listings/edit.ejs", { listing ,originalImageUrl});
  };

module.exports.update=async (req, res,next) => {
  
    let { id } = req.params;
    let listing =await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(req.file){
      let url=req.file.path;
      let filename = req.file.filename;
      listing.image ={url,filename};
      
    }
    console.log(req.file);
    await listing.save();
    req.flash("success", "Updated Sucessfully");
    res.redirect(`/listings/${id}`);
  }

module.exports.delete= async (req, res,next) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("error","deleted Successfuly");
    res.redirect("/listings");
  };