const inquirer = require('inquirer').default;
const fs = require('fs');
const path = require('path');
const deliveryLetterSchema = require('./validators/deliveryLetterValidator')
const FILE_PATH = path.join(__dirname, 'deliveryLetters.json');

const FIXED_USER_ID = '67eff00020f049d621d14a23';
const FIXED_SELLER_ID = "68907f4a75aed78020ce6e8e";

// Helper to load saved data
const loadExistingLetters = () => {
  if (fs.existsSync(FILE_PATH)) {
    return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
  }
  return [];
};

// Helper to save new data
const saveLetter = (entry) => {
  const letters = loadExistingLetters();
  letters.push(entry);
  fs.writeFileSync(FILE_PATH, JSON.stringify(letters, null, 2), 'utf8');
};

async function askDeliveryLetter() {
  const answers = await inquirer.prompt([
    // --- Top-level fields ---
    {
      name: 'received',
      message: 'Received? (true/false)',
      type: 'confirm',
      default: true,
    },
    {
      name: 'deliveryLetterDate',
      message: 'Delivery Letter Date (YYYY-MM-DD)',
      validate: input => /^\d{4}-\d{2}-\d{2}$/.test(input) || 'Please use YYYY-MM-DD format',
    },
    {
      name: 'deliveryLetterTime',
      message: 'Delivery Letter Time (HH:mm, 24-hour format)',
      validate: input => /^([01]\d|2[0-3]):([0-5]\d)$/.test(input) || 'Please use HH:mm format (24-hour)',
      default: '00:00',
    },


    // --- Car Details ---
    {
      name: 'carDetails.registrationNo',
      message: 'Registration No',
      validate: input => input.trim() !== '' || 'Registration No is required',
      default: 'UNREGISTERED'
    },
    {
      name: 'carDetails.registrationDate',
      message: 'Registration Date (YYYY-MM-DD) default null',
      default: null
    },
    {
      name: 'carDetails.chassisNo',
      message: 'Chassis No',
      validate: input => input.trim() !== '' || 'Chassis No is required',
    },
    // Optional car detail fields with default = ''
    {
      name: 'carDetails.engineNo',
      message: 'Engine No',
      default: '',
    },
    {
      name: 'carDetails.make',
      message: 'Make',
      default: '',
    },
    {
      name: 'carDetails.model',
      message: 'Model',
      default: '',
    },
    {
      name: 'carDetails.color',
      message: 'Color',
      default: '',
    },
    {
      name: 'carDetails.hp',
      message: 'Horsepower (hp)',
      default: 0,
    },
    {
      name: 'carDetails.registrationBookNumber',
      message: 'Registration Book No',
      default: '',
    },
    // --- Purchaser Info ---
    {
      name: 'carDealership.purchaser.name',
      message: "Purchaser's Name (required)",
      validate: input => input.trim() !== '' || 'Chassis No is required',
      default: '',
    },
    {
      name: 'carDealership.purchaser.address',
      message: "Purchaser's Address",
      default: '',
    },
    {
      name: 'carDealership.purchaser.tel',
      message: "Purchaser's Tel No (required)",
      validate: input => input.trim() !== '' || 'Purchaser Telephone is Required',
    },
    {
      name: 'carDealership.purchaser.nic',
      message: "Purchaser's NIC (13-digit CNIC, optional)",
      default: '',
    },
  ]);

    // Post-processing before validation
    const nestFlatObject = (flatObj) => {
        const nested = {};
        for (const key in flatObj) {
            const keys = key.split('.');
            keys.reduce((acc, curr, i) => {
            if (i === keys.length - 1) {
                acc[curr] = flatObj[key];
            } else {
                acc[curr] = acc[curr] || {};
            }
            return acc[curr];
            }, nested);
        }
        return nested;
    };

    const combinedDateTimeString = `${answers.deliveryLetterDate}T${answers.deliveryLetterTime}`;
    console.log(combinedDateTimeString)
    const fixedDate = new Date(`${combinedDateTimeString}:00Z`);
    console.log(fixedDate)

    const processed = {
      user: FIXED_USER_ID,
      deliveryLetterDate: fixedDate,
      received: answers.received,
      ...nestFlatObject(answers)  // 🪄 Automatically nests carDetails, carDealership, etc.
    };

    delete processed.deliveryLetterTime
    processed.deliveryLetterDate = fixedDate
    // console.log('Before validation ISO CONVERTED:', processed.deliveryLetterDate);
    // Validate before saving
    processed.carDealership.sellerId = FIXED_SELLER_ID
    const { error, value: validatedLetter } = deliveryLetterSchema.validate(processed, { abortEarly: false });
    // console.log(processed.deliveryLetterDate)
    if (error) {
      console.log("\n❌ Validation Errors:");
      error.details.forEach(detail => {
        console.log(`  - [${detail.path.join('.')}] ${detail.message.replace(/"/g, '')}`);
    });
    const { retry } = await inquirer.prompt({
      type: 'confirm',
      name: 'retry',
      message: 'Do you want to retry entering this letter?',
      default: true,
    });
    
    // console.log('After validation ISO CONVERTED:', processed.deliveryLetterDate);

    if (retry) {
      return await askDeliveryLetter(); // Recursive retry
    } else {
      console.log("⏭️  Skipping entry...");
      return;
    }
  }

  // Save to file
  saveLetter(validatedLetter);
  console.log(`✅ Saved entry to file. (Total entries: ${loadExistingLetters().length})\n`);

  // Ask if user wants to continue
  const { again } = await inquirer.prompt({
    type: 'confirm',
    name: 'again',
    message: 'Do you want to enter another delivery letter?',
    default: true,
  });

  if (again) {
    await askDeliveryLetter();
  } else {
    console.log("👋 Done. You can find your data in deliveryLetters.json");
  }
}

// Entry point
askDeliveryLetter();
