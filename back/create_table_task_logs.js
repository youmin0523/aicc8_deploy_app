const { pool } = require('./database/database');

const run = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS task_logs (
        _id TEXT PRIMARY KEY,
        taskId TEXT REFERENCES tasks_v2(_id) ON DELETE CASCADE,
        changeType TEXT NOT NULL,
        logMessage TEXT NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('task_logs table created successfully');
  } catch (e) {
    console.error('Error creating table:', e);
  } finally {
    pool.end();
  }
};

run();
