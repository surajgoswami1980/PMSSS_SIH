const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  Name: String,
  college: String,
  Affiliated:String,
  State: String,
  District: String,
  type: String,
  secretCode: { type: String, required: true },
});

const College = mongoose.model('College', collegeSchema);
module.exports = College;
