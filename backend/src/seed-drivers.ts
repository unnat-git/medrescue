import db from './db';

const drivers = [
  { name: 'Kushal Das', phone: '+919876543210', vehicle: 'WB01-A1234', lat: 22.5186, lng: 88.4067, pincode: '700107' },
  { name: 'Amit Roy', phone: '+919876543211', vehicle: 'WB01-B5678', lat: 22.5190, lng: 88.4070, pincode: '700107' },
  { name: 'Rahul Sen', phone: '+919876543212', vehicle: 'WB01-C9012', lat: 22.5200, lng: 88.4050, pincode: '700107' },
  { name: 'Santu Pal', phone: '+919876543213', vehicle: 'WB01-D3456', lat: 22.5170, lng: 88.4080, pincode: '700107' },
  { name: 'Bikram De', phone: '+919876543214', vehicle: 'WB01-E7890', lat: 22.5210, lng: 88.4090, pincode: '700107' },
  { name: 'Joy Ghosh', phone: '+919876543215', vehicle: 'WB01-F1234', lat: 22.5220, lng: 88.4100, pincode: '700107' },
  { name: 'Subhankar Maity', phone: '+919876543216', vehicle: 'WB01-G5678', lat: 22.5150, lng: 88.4040, pincode: '700107' },
  { name: 'Debasish Kar', phone: '+919876543217', vehicle: 'WB01-H9012', lat: 22.5160, lng: 88.4030, pincode: '700107' },
  { name: 'Pradip Mal', phone: '+919876543218', vehicle: 'WB01-I3456', lat: 22.5230, lng: 88.4110, pincode: '700107' },
  { name: 'Sujoy Khan', phone: '+919876543219', vehicle: 'WB01-J7890', lat: 22.5240, lng: 88.4120, pincode: '700107' },
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
