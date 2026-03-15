import db from './db';

async function migrate() {
  try {
    console.log('Starting migration...');

    // 1. Add new columns to ambulances table if they don't exist
    await db.query(`
      ALTER TABLE ambulances 
      ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50),
      ADD COLUMN IF NOT EXISTS ambulance_number VARCHAR(50),
      ADD COLUMN IF NOT EXISTS service_area_pincode VARCHAR(20)
    `);

    // 2. Add UNIQUE constraint to medical_profiles if it doesn't exist
    // First check if it exists
    const checkUnique = await db.query(`
      SELECT 1 FROM pg_constraint WHERE conname = 'medical_profiles_user_id_key'
    `);
    
    if (checkUnique.rows.length === 0) {
      console.log('Adding UNIQUE constraint to medical_profiles(user_id)...');
      await db.query(`ALTER TABLE medical_profiles ADD CONSTRAINT medical_profiles_user_id_key UNIQUE (user_id)`);
    }

    // 3. Update emergency_requests to set ambulance_id to NULL so we can re-seed ambulances
    console.log('Clearing old ambulance references...');
    await db.query(`UPDATE emergency_requests SET ambulance_id = NULL`);
    
    console.log('Migration complete.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
