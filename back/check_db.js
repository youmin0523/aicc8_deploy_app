const { pool } = require('./database/database');

async function checkSchema() {
  console.log('--- Connecting to DB ---');
  try {
    const client = await pool.connect();
    console.log('--- Connected Successfully ---');

    console.log('Checking tasks_v2 schema...');
    const res = await client.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'tasks_v2';",
    );
    if (res.rows.length === 0) {
      console.log('Table tasks_v2 NOT FOUND!');
    } else {
      res.rows.forEach((row) => {
        console.log(`  ${row.column_name}: ${row.data_type}`);
      });
    }

    console.log('\nChecking categories schema...');
    const res2 = await client.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'categories';",
    );
    if (res2.rows.length === 0) {
      console.log('Table categories NOT FOUND!');
    } else {
      res2.rows.forEach((row) => {
        console.log(`  ${row.column_name}: ${row.data_type}`);
      });
    }

    client.release();
    console.log('\n--- Done ---');
    process.exit(0);
  } catch (err) {
    console.error('--- DB CONNECTION ERROR ---');
    console.error(err);
    process.exit(1);
  }
}

checkSchema();
