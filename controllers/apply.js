
const user = require("../models/user.js");
const Scholar = require("../models/apply.js");
const session = require('express-session');
const cloudinary = require('cloudinary').v2;
const College = require('../models/college.js'); // Adjust the path as necessary
const University = require('../models/university.js'); // Adjust the path as necessary

module.exports.apply = async (req, res, next) => {

    
    res.render('listings/apply.ejs');
 
};


  const generateScholarshipNumber = () => {
    const timestamp = Date.now(); // Current timestamp for uniqueness
    const random = Math.floor(Math.random() * 10000); // Random number
    return `SCH${timestamp}${random}`;
};
// module.exports.submitpersonaldetails = async (req, res, next) => {
//   try {
//     // Fetch all colleges and universities
//     const { fullName, email, dateOfBirth, category, phoneNumber, otherPhoneNumber, motherName, fatherName, address, city, state, zip, country } = req.body.personalDetails || {};
    
//     // Store personal details in session
//     req.session.personalDetails = { fullName, email, dateOfBirth, category, phoneNumber, otherPhoneNumber, motherName, fatherName, address, city, state, zip, country };
//     const colleges = await College.find().exec();
//     const universities = await University.find().exec();
    
//     // Extract unique states from colleges and universities data
//     const states = [...new Set([...colleges.map(college => college.State), ...universities.map(university => university.state)])];
    
//     res.render('listings/acedmicdetails.ejs', { colleges, universities, states });
//   } catch (error) {
//     next(error);
//   }
// }

module.exports.submitpersonaldetails = async (req, res, next) => {
  try {
    // Log the entire request body
    console.log('Received body:', req.body);
    
    const { fullName, email, dateOfBirth, category, phoneNumber, otherPhoneNumber, motherName, fatherName, address, city, state, zip, country } = req.body.personalDetails || {};
    
    // Store personal details in session
    req.session.personalDetails = { fullName, email, dateOfBirth, category, phoneNumber, otherPhoneNumber, motherName, fatherName, address, city, state, zip, country };
    
    const colleges = await College.find().exec();
    const universities = await University.find().exec();
    
    // Extract unique states from colleges and universities data
    const states = [...new Set([...colleges.map(college => college.State), ...universities.map(university => university.state)])];
    
    res.render('listings/acedmicdetails.ejs', { colleges, universities, states });
  } catch (error) {
    next(error);
  }
}
module.exports.submitacedmicdetails = async (req, res, next) => {
  try {
    // Log the entire request body
    console.log('Received body:', req.body);
    
    const { institution, statei, RollNumber, course, Enrollment, passingYear, CGPA, matricMarks, matricSubjects, passingYear10, schoolname10, percentage10, twelfthMarks, twelfthSubjects, passingYear12, schoolname12, percentage12 } = req.body.academicDetails || {};
    
    console.log('Academic details received:', { institution, statei, RollNumber, course, Enrollment, passingYear, CGPA, matricMarks, matricSubjects });
    
    // Store academic details in session
    req.session.academicDetails = { institution, statei, RollNumber, course, Enrollment, passingYear, CGPA, matricMarks, matricSubjects, passingYear10, schoolname10, percentage10, twelfthMarks, twelfthSubjects, passingYear12, schoolname12, percentage12 };

    res.render('listings/bankdetails.ejs'); // Redirect to bank details form
  } catch (error) {
    next(error);
  }
};


module.exports.submitbankdetails = async (req, res, next) => {
  try {
    const { accountHolderName, accountNumber, reAccountNumber, ifscCode, branchAddress } = req.body.bankDetails || {};
    
    // Debugging log
    console.log('Bank details received:', { accountHolderName, accountNumber, reAccountNumber, ifscCode, branchAddress });
    
    // Store bank details in session
    req.session.bankDetails = { accountHolderName, accountNumber, reAccountNumber, ifscCode, branchAddress };
    
    res.render('listings/documents.ejs'); // Redirect to document upload form
  } catch (error) {
    console.error('Error in submitbankdetails:', error);
    next(error);
  }
};



// Controller for handling scholarship form submission
module.exports.submitScholarship = async (req, res, next) => {
  try {
    // Retrieve all the details from the session
    const personalDetails = req.session.personalDetails;
    const academicDetails = req.session.academicDetails;
    const bankDetails = req.session.bankDetails;

    if (!personalDetails || !academicDetails || !bankDetails) {
      throw new Error('Incomplete scholarship form details');
    }

    const scholarshipNumber = generateScholarshipNumber();

    // Create new scholarship entry
    const newScholarship = new Scholar({
      scholarshipNumber,
      userId: req.user._id,
      personalDetails,
      academicDetails,
      bankDetails,
      status: "Pending",
      bankStatus: "Pending",
      governmentStatus: "Pending",
      moneyRecevied: "Not-Received",
      applicationDate: Date.now(),
    });

    // Handle file uploads (if any)
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => ({
        imageId: file.filename,
        imageUrl: file.path,
      }));
      newScholarship.images = images;
    }

    // Save the new scholarship
    await newScholarship.save();
    
    // Clear session data after submission
    req.session.personalDetails = null;
    req.session.academicDetails = null;
    req.session.bankDetails = null;

    req.flash("success", "Scholarship application submitted successfully.");
    res.redirect("/listings");
  } catch (error) {
    next(error);
  }
};


module.exports.trackapplication= async (req, res, next) => {
  const ownerId = req.user._id; // Get the current user's ID
  // const {id}=req.params;
  const  Scholars= await Scholar.find({ userId: ownerId });
console.log("hello");
  if (!Scholars.length===0) {
      req.flash("error", "You have nnot applied for a scholarship");
      return res.redirect("/listings");
  }

  res.render("listings/trackapplication.ejs", { Scholars  });
};

module.exports.collegeverification = async (req, res, next) => {
  try {
    console.log("Starting college verification");

    // Fetch all colleges and universities
    const colleges = await College.find().exec();
    // console.log("Fetched colleges:", colleges);

    const universities = await University.find().exec();
    // console.log("Fetched universities:", universities);

    const ownerId = req.user._id;
    const collegeUniversity = await user.findById(ownerId);
    // console.log("Fetched user for verification:", collegeUniversity);
    const  Scholars= await Scholar.find({ "academicDetails.institution": collegeUniversity.username  });
    // Ensure colleges and universities are non-empty
    if (!colleges || !universities || !collegeUniversity) {
      console.log("Data missing or invalid");
      req.flash("error", "Data missing for verification");
      return res.redirect("/listings");
    }

    // Check if the user's college matches any in the fetched colleges/universities
    if (Scholars.length > 0) {
      console.log("Match found for verification");
      res.render('listings/collegeUniversity.ejs', { Scholars, ownerId });
    } else {
      console.log("No match for verification");
      req.flash("error", "Nothing for verification");
      res.redirect("/listings");
    }

  } catch (error) {
    console.error("Error in college verification:", error);
    next(error);  // Pass error to the error handler
  }
};

module.exports.viewscholars = async (req, res, next) => {
  try {
    // Get the current user's ID
    const ownerId = req.user._id;

    // Extract the scholar ID from the request parameters
    let { scholarid } = req.params;

    // Fetch the scholar details by ID
    const scholar = await Scholar.findById(scholarid);

    // Ensure scholar data is available
    if (scholar) {
      console.log("Scholar found for verification");
      res.render('listings/viewscholars.ejs', { scholar }); // Note: Use 'scholar' not 'Scholars'
    } else {
      console.log("Scholar not found for verification");
      req.flash("error", "Scholar not found for the provided ID");
      res.redirect("/listings");
    }

  } catch (error) {
    console.error("Error in viewing scholar:", error);
    next(error);  // Pass error to the error handler
  }
};

module.exports.updatestatus =  async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status === 'Approved') {
      
        await Scholar.findByIdAndUpdate(id, { status: 'Approved' ,rejectionReason: "" });
        req.flash('success', 'Scholarship approved and status updated to Completed');
    }

    res.redirect(`/listings`);
} catch (error) {
    console.error("Error updating scholarship status:", error);
    next(error);
}
};
module.exports.rejectedstatus= async (req, res, next) => {
  try {
      const { id } = req.params;
      const { reason } = req.body;

      await Scholar.findByIdAndUpdate(id, {
          status: 'Rejected',
          rejectionReason: reason
      });

      req.flash('error', `Scholarship rejected: ${reason}`);
      res.redirect(`/listings`);
  } catch (error) {
      console.error("Error rejecting scholarship:", error);
      next(error);
  }
};


// module.exports.submitScholarship = async (req, res, next) => {
//   try {
//     // Destructure form fields
//     const { fullName, email, dateOfBirth, category, phoneNumber, otherPhoneNumber, motherName, fatherName, address, city, state, zip, country } = req.body.personalDetails;
//     const { institution, statei, RollNumber, course, Enrollment, passingYear, CGPA, matricMarks, matricSubjects, passingYear10, schoolname10, percentage10, twelfthMarks, twelfthSubjects, passingYear12, schoolname12, percentage12 } = req.body.academicDetails;
//     const { accountHolderName, accountNumber, reAccountNumber, ifscCode, branchAddress } = req.body.bankDetails;
//     const scholarshipNumber = generateScholarshipNumber();

//     // Ensure that institution is a single value (not an array)
//     // const selectedInstitution = Array.isArray(institution) ? institution[0] : institution;

//     // Create new scholarship entry
//     const newScholarship = new Scholar({
//       scholarshipNumber,
//       userId: req.user._id,
//       personalDetails: {
//         fullName, email, dateOfBirth, category, phoneNumber, otherPhoneNumber, motherName, fatherName, address, city, state, zip, country,
//       },
//       academicDetails: {
//         institution,  // Ensure this is a single value
//         course, passingYear, RollNumber, statei, Enrollment, CGPA, matricMarks, matricSubjects, passingYear10, percentage10, twelfthMarks, twelfthSubjects, passingYear12, schoolname12, schoolname10, percentage12,
//       },
//       bankDetails: {
//         accountHolderName, accountNumber, reAccountNumber, ifscCode, branchAddress,
//       },
//       status: "Pending",
//       bankStatus: "Pending",
//       governmentStatus: "Pending",
//       moneyRecevied: "Not-Received",
//       applicationDate: Date.now(),
//     });

//     // Handle file uploads
//     if (req.files && req.files.length > 0) {
//       const images = req.files.map(file => ({
//         imageId: file.filename,
//         imageUrl: file.path,
//       }));
//       newScholarship.images = images;
//     }

//     // Save the new scholarship
//     await newScholarship.save();
//     req.flash("success", "Scholarship application submitted successfully.");
//     res.redirect("/listings");  // Redirect to dashboard or relevant page
//   } catch (error) {
//     next(error);  // Handle any errors
//   }
// };