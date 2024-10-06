const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  Name: String,
  City: String,
  Address:String,
  state: String,
  zip:String,
  secretCode: { type: String, required: true },
});

const University = mongoose.model('University', universitySchema);
module.exports = University;
