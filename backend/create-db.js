const { Client } = require('pg');

async function createDb() {
  // Connect to the default 'postgres' database
  const client = new Client({
    connectionString: 'postgresql://postgres:MUJ8@forever@localhost:5432/postgres'
  });

  try {
    await client.connect();
    
    // Check if asked_db exists
    const res = await client.query("SELECT datname FROM pg_database WHERE datname = 'asked_db'");
    
    if (res.rowCount === 0) {
      console.log('Database "asked_db" does not exist. Creating...');
      await client.query('CREATE DATABASE asked_db');
      console.log('Database "asked_db" created successfully.');
    } else {
      console.log('Database "asked_db" already exists. Skipping creation.');
    }
  } catch (error) {
    console.error('Error creating database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createDb();
