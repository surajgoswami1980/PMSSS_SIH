const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");
const fs = require('fs');
const csv = require('csv-parser');
const College = require('../models/college.js');
const University = require('../models/university.js');
const Bank = require('../models/bank.js');
const MONGO_URL = "mongodb://127.0.0.1:27017/SIH";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL,{ useNewUrlParser: true,
    useUnifiedTopology: true})
 
};
const generateSecretCode = () => {
  const segment = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  return `${segment(4)}-${segment(4)}-${segment(4)}-${segment(4)}`; // Format: XXXX-XXXX-XXXX-XXXX
};


// const initDB = async () => {
  
//   initData.data =initData.data.map((obj)=>({
//     ...obj , owner : "66cc8c0030b222bfcbbfceba",
//   }));
//   await Listing.insertMany(initData.data);
  
//   console.log("data was initialized");
// };
const importCSV = async (filePath, model) => {
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      // Add a unique secret code to each record
      data.secretCode = generateSecretCode(); // Adjust to your preferred format
      results.push(data);
    })
    .on('end', async () => {
      try {
        await model.insertMany(results);
        console.log('Data imported successfully with secret codes!');
      } catch (error) {
        console.error('Error importing data:', error);
      } finally {
        mongoose.connection.close();
      }
    });
};


// Impor
// importCSV('./college.csv', College);

// Import University Data
// importCSV('./university.csv', University);

const importCSV1 = async (filePath, model) => {
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      // Add a unique secret code to each record
      data.secretCode = generateSecretCode(); // Adjust to your preferred format
      results.push(data);
    })
    .on('end', async () => {
      try {
        await model.insertMany(results);
        console.log('Data imported successfully with secret codes!');
      } catch (error) {
        console.error('Error importing data:', error);
      } finally {
        mongoose.connection.close();
      }
    });
};

// Import Bank Data
importCSV1('./IFSC.csv', Bank);
