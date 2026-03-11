import db from './db';

const fixAmbulances = async () => {
  try {
    await db.query(`UPDATE ambulances SET status = 'available';`);
    console.log('Fixed ambulances');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
};

fixAmbulances();
