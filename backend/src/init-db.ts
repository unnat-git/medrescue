import fs from 'fs';
import path from 'path';
import db from './db';

const initDB = async () => {
  try {
    // Read the schema.sql file
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Applying database schema...');
    
    // Execute the schema SQL
    await db.query(schema);
    
    console.log('Database schema initialized successfully');
  } catch (err) {
    console.error('Error initializing database schema:', err);
    process.exit(1); // Exit if DB init fails (optional, depending on desired robustness)
  }
};

export default initDB;
