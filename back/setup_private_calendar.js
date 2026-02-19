const { pool } = require('./database/database');
const fs = require('fs');
const path = require('path');

const setupPrivateCalendar = async () => {
  try {
    const sqlPath = path.join(
      __dirname,
      'database',
      'database_private_calendar.sql',
    );
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('--- Private Calendar Table Setup Started ---');
    await pool.query(sql);
    console.log('--- Private Calendar Table Setup Completed Successfully ---');
    process.exit(0);
  } catch (err) {
    console.error('Error setting up Private Calendar tables:', err);
    process.exit(1);
  }
};

setupPrivateCalendar();
