const { pool } = require('./database/database');

const updateSchema = async () => {
  try {
    console.log('Updating private_habit_logs schema...');
    await pool.query(`
            ALTER TABLE private_habit_logs 
            ADD CONSTRAINT unique_habit_date UNIQUE (habitId, check_date);
        `);
    console.log('Constraint added successfully.');
    process.exit(0);
  } catch (err) {
    if (err.code === '42710') {
      console.log('Constraint already exists.');
      process.exit(0);
    }
    console.error('Error updating schema:', err);
    process.exit(1);
  }
};

updateSchema();
