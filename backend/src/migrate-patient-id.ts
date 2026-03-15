import db from './db';
import crypto from 'crypto';

function generatePatientId() {
  return `PAT-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

async function migrate() {
  try {
    console.log('Starting Patient ID migration...');

    // 1. Add patient_id column if it doesn't exist
    await db.query(`
      ALTER TABLE medical_profiles 
      ADD COLUMN IF NOT EXISTS patient_id VARCHAR(50)
    `);

    // 2. Fetch existing profiles without a patient_id
    const profiles = await db.query('SELECT id FROM medical_profiles WHERE patient_id IS NULL');
    
    console.log(`Populating patient_id for ${profiles.rows.length} profiles...`);

    for (const row of profiles.rows) {
      let patientId = generatePatientId();
      // Simple collision check (for migration)
      let isUnique = false;
      while (!isUnique) {
        const check = await db.query('SELECT 1 FROM medical_profiles WHERE patient_id = $1', [patientId]);
        if (check.rows.length === 0) {
          isUnique = true;
        } else {
          patientId = generatePatientId();
        }
      }

      await db.query('UPDATE medical_profiles SET patient_id = $1 WHERE id = $2', [patientId, row.id]);
    }

    // 3. Make patient_id UNIQUE and NOT NULL
    console.log('Enforcing constraints on patient_id...');
    await db.query(`
      ALTER TABLE medical_profiles 
      ALTER COLUMN patient_id SET NOT NULL,
      ADD CONSTRAINT medical_profiles_patient_id_key UNIQUE (patient_id)
    `);

    console.log('Migration successfully completed.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
