import db from './db';

const drivers = [
  { name: 'Rahul Das', phone: '+919876543210', vehicle: 'WB04AB1234', lat: 22.5705, lng: 88.4320, pincode: '700107' },
  { name: 'Arjun Singh', phone: '+919876543211', vehicle: 'WB04AB2234', lat: 22.5689, lng: 88.4308, pincode: '700107' },
  { name: 'Santu Pal', phone: '+919876543213', vehicle: 'WB04AB3456', lat: 22.5710, lng: 88.4330, pincode: '700107' },
  { name: 'Bikram De', phone: '+919876543214', vehicle: 'WB04AB7890', lat: 22.5720, lng: 88.4340, pincode: '700107' },
  { name: 'Joy Ghosh', phone: '+919876543215', vehicle: 'WB04AB1256', lat: 22.5695, lng: 88.4315, pincode: '700107' },
  { name: 'Subhankar Maity', phone: '+919876543216', vehicle: 'WB04AB5678', lat: 22.5680, lng: 88.4290, pincode: '700107' },
  { name: 'Debasish Kar', phone: '+919876543217', vehicle: 'WB04AB9012', lat: 22.5730, lng: 88.4350, pincode: '700107' },
  { name: 'Pradip Mal', phone: '+919876543218', vehicle: 'WB04AB3478', lat: 22.5740, lng: 88.4360, pincode: '700107' },
  { name: 'Sujoy Khan', phone: '+919876543219', vehicle: 'WB04AB7812', lat: 22.5750, lng: 88.4370, pincode: '700107' },
  { name: 'Amit Roy', phone: '+919876543212', vehicle: 'WB04AB5690', lat: 22.5700, lng: 88.4310, pincode: '700107' },
];

async function seedDrivers() {
  try {
    console.log('Seeding ambulance drivers...');
    
    // Clear existing drivers to avoid duplicates during resync
    await db.query('DELETE FROM ambulances');

    for (const driver of drivers) {
      await db.query(
        `INSERT INTO ambulances (driver_name, phone_number, ambulance_number, service_area_pincode, latitude, longitude, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'available')`,
        [driver.name, driver.phone, driver.vehicle, driver.pincode, driver.lat, driver.lng]
      );
    }

    console.log('Successfully seeded 10 ambulance drivers around Anandapura (700107).');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding drivers:', err);
    process.exit(1);
  }
}

seedDrivers();
