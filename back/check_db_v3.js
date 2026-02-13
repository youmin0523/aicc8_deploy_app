const { pool } = require('./database/database');
const fs = require('fs');

async function check() {
  let output = '';
  try {
    const res = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';",
    );
    output += 'Tables in public schema:\n';
    res.rows.forEach((row) => {
      output += `- ${row.table_name}\n`;
    });

    const res2 = await pool.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'tasks_v2';",
    );
    output += '\nColumns in tasks_v2:\n';
    res2.rows.forEach((row) => {
      output += `- ${row.column_name} (${row.data_type})\n`;
    });
  } catch (err) {
    output += `ERROR: ${err.message}\n`;
  }
  fs.writeFileSync('db_check_result.txt', output);
  process.exit(0);
}

check();
