const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const scholarSchema = new Schema({
  scholarshipNumber: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
   rejectionReason: String,
  personalDetails: {
    fullName: String,
    email: String,
    dateOfBirth: Date,
    category: String,
    phoneNumber: String,
    otherPhoneNumber: String,
    motherName: String,
    fatherName: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  academicDetails: {
    institution: String,
    course: String,
    passingYear: Number,
    CGPA: Number,
    Enrollment:String,
    statei:String,
    RollNumber:Number,
    matricMarks: Number,
    matricSubjects: String,
    passingYear10: Number,
    schoolname10: String,
    percentage10:Number,
    twelfthMarks: Number,
    twelfthSubjects: String,
    passingYear12: Number,
    schoolname12: String,
    percentage12:Number,
  },
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    reAccountNumber: String,
    ifscCode: String,
    branchAddress: String,
  },
  images: [
    {
      imageId: String, // Cloudinary image ID
      imageUrl: String, // Cloudinary image URL
    },
  ],
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  bankStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  governmentStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  moneyRecevied: {
    type: String,
    enum: ['Received', 'Not-Received'], // Fix the typo
    default: 'Not-Received',
  }
,  
   applicationDate: {
    type: Date,
    default: Date.now
  },

});
const Scholar = mongoose.model("Scholar", scholarSchema);
module.exports = Scholar;