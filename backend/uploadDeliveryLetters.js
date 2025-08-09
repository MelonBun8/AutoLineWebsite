const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const DeliveryLetter = require('./models/DeliveryLetter'); 

const FILE_PATH = path.join(__dirname, 'deliveryLetters.json');

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

async function runUpload() {
  try {
    if (!fs.existsSync(FILE_PATH)) {
      console.error('❌ deliveryLetters.json not found.');
      process.exit(1);
    }

    const rawData = fs.readFileSync(FILE_PATH, 'utf-8');
    let deliveryLetters = JSON.parse(rawData);

    if (!Array.isArray(deliveryLetters)) {
      console.error('❌ Invalid format. Must be an array of documents.');
      process.exit(1);
    }

    const inserted = await DeliveryLetter.insertMany(deliveryLetters, { ordered: false });
    console.log(`✅ Successfully inserted ${inserted.length} delivery letters.`);

    const BACKUP_PATH = path.join(__dirname, 'DLBACKUP.json')
    let existingBackup = []
    if(fs.existsSync(BACKUP_PATH)){ // if backup path exists (file exists)
      const backupRaw = fs.readFileSync(BACKUP_PATH, 'utf-8') // get file contents
      try{
        existingBackup = JSON.parse(backupRaw) || [];
        if(!Array.isArray(existingBackup)) existingBackup = [];
      } catch(e) {
        console.warn('⚠️ DLBACKUP.json is not valid JSON. Starting with an empty array.')
        existingBackup = []
      }
    }

    const updatedBackup = existingBackup.concat(deliveryLetters)
    fs.writeFileSync(BACKUP_PATH, JSON.stringify(updatedBackup, null, 2));
    console.log(`📦 Appended ${deliveryLetters.length} records to DLBACKUP.json.`);


    // clearing the file after success
    fs.writeFileSync(FILE_PATH, '[]');
    console.log('🧹 deliveryLetters.json has been cleared.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Bulk upload failed:', err.message);

    // Log failed entries if partial success is possible
    if (err.writeErrors) {
      const failed = err.writeErrors.map(e => e.err.op);
      fs.writeFileSync(path.join(__dirname, 'failed_deliveryLetters.json'), JSON.stringify(failed, null, 2));
      console.error(`🚨 ${failed.length} documents failed. Saved to failed_deliveryLetters.json`);
    }

    process.exit(1);
  }
}

runUpload();
