if(process.env.NODE_ENV!="production"){
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate =require("ejs-mate");
const MONGO_URL = "mongodb://127.0.0.1:27017/SIH";
const wrapAsync =require("./utils/wrapAsync.js");
const ExpressError =require("./utils/ExpressError.js");
const listingRouter =require("./routes/listing.js");
const reviewRouter =require("./routes/review.js");
const userRouter =require("./routes/user.js");
const session = require("express-session");
//const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const userRoutes = require('./routes/user.js');
const User = require("./models/user.js");
const Listing = require("./models/listings.js");
const passportConfig = require('./passport');
const dbUrl = process.env.ATLASDB_URL;
const applyRoutes = require('./routes/apply.js'); // Adjust path if needed


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.json()); 
app.use(express.static(path.join(__dirname, "public")));

// session

// const store = MongoStore.create({
//   mongoUrl:dbUrl,
//   crypto:{
//     secret:process.env.SECRET,
//   },
//   touchAfter:24*3600,
// });

// store.on("error",()=>{
//   console.log("ERROR in MONGO SESSION STORE",err);
// });

const sessionOptions ={
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7  * 24 * 60 * 60 * 1000,
    maxAge:7  * 24 * 60 * 60 * 1000,
    httpOnly:true,
  },
};
app.use(session(sessionOptions));
app.use(flash());


passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});

// app.get("/demouser", async (req, res) => {
//   let fakeUser= new User({
//     email:"surajgoswami1@gmail.com",
//     username:"suraj1234",
//   });
//   let registeredUser = await User.register(fakeUser,"helloworld");
//   res.send(registeredUser);
// });

app.get("/",wrapAsync( async (req, res,next) => {
  const allListings = await Listing.find({});
    
  res.render("listings/index.ejs", { allListings });
}));

// route for listigs
app.use("/listings", listingRouter);
app.use('/', userRoutes);
// Route for review

app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/", applyRoutes);

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found !"));
})
app.use((err,req,res,next)=>{
  let{statuscode=402,message="something went wrong "}=err;
  res.status(statuscode).render("error.ejs",{message});
});

app.listen(8082, () => {
  console.log("server is listening to port 8082");
});
