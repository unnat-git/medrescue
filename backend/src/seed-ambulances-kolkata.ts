import db from './db';

const AMBULANCES_TO_SEED = 12;
const KCLK_LAT = 22.514121;
const KCLK_LNG = 88.408516;
const PINCODE = '700107';

// Approx 10km in degrees
const LAT_OFFSET = 0.09; 
const LNG_OFFSET = 0.09;

const drivers = [
  "Ravi Kumar", "Amit Singh", "Suresh Das", "Vikram Sen", 
  "Arun Chatterjee", "Manoj Guha", "Deepak Bose", "Pritam Roy",
  "Sujit Bannerjee", "Rahul Mitra", "Animesh Pal", "Subhash Nag"
];

const seedAmbulances = async () => {
  try {
    console.log(`Starting to seed ${AMBULANCES_TO_SEED} ambulances in Kolkata (700107)...`);
    
    for (let i = 0; i < AMBULANCES_TO_SEED; i++) {
      const driver_name = drivers[i % drivers.length];
      const phone_number = `+919${Math.floor(100000000 + Math.random() * 900000000)}`;
      const ambulance_number = `WB-01-${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Random coordinates within ~10km
      const latitude = KCLK_LAT + (Math.random() - 0.5) * LAT_OFFSET;
      const longitude = KCLK_LNG + (Math.random() - 0.5) * LNG_OFFSET;

      await db.query(
        `INSERT INTO ambulances (driver_name, phone_number, ambulance_number, service_area_pincode, latitude, longitude, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'available')`,
        [driver_name, phone_number, ambulance_number, PINCODE, latitude, longitude]
      );
    }

    console.log('Successfully seeded ambulances!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding ambulances:', err);
    process.exit(1);
  }
};

seedAmbulances();
