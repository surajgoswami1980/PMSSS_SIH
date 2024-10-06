const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankSchema = new Schema({
  BANK: { type: String, required: true },
  IFSC: { type: String, required: true },
  BRANCH: { type: String, required: true },
  CENTRE: { type: String, required: true },
  DISTRICT: { type: String, required: true },
  STATE: { type: String, required: true },
  ADDRESS: { type: String, required: true },
  secretCode: { type: String, required: true }
});

const Bank = mongoose.model("Bank", bankSchema);
module.exports = Bank;
