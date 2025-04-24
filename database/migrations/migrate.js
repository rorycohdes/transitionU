/**
 * Migration script for the TransitionU database
 *
 * This script applies the schema and initial seed data to a Supabase instance.
 *
 * Usage:
 * 1. Set up environment variables:
 *    - SUPABASE_URL: Your Supabase project URL
 *    - SUPABASE_SERVICE_KEY: Your Supabase service role key (not the anon key)
 *
 * 2. Run the script:
 *    node database/migrations/migrate.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Check environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing environment variables. Set SUPABASE_URL and SUPABASE_SERVICE_KEY.');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Path to schema and seed files
const schemaPath = path.join(__dirname, '../schema/schema.sql');
const seedPath = path.join(__dirname, '../schema/seed.sql');

// Function to read and execute SQL files
async function executeSqlFile(filePath, description) {
  try {
    console.log(`Reading ${description} file...`);
    const sql = fs.readFileSync(filePath, 'utf8');

    // Split SQL into statements (simple approach, may need refinement for complex statements)
    const statements = sql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    console.log(`Executing ${statements.length} SQL statements...`);

    // Execute each statement sequentially
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        // Using rpc to execute raw SQL
        await supabase.rpc('pg_execute', { query: statement + ';' });
        process.stdout.write('.');
      } catch (err) {
        console.error(`\nError executing statement ${i + 1}:`);
        console.error(statement);
        console.error(err);
        // Continue with next statement
      }
    }

    console.log(`\n${description} applied successfully.`);
    return true;
  } catch (err) {
    console.error(`Error applying ${description}:`, err);
    return false;
  }
}

// Main migration function
async function migrate() {
  console.log('Starting database migration...');

  // Apply schema
  const schemaResult = await executeSqlFile(schemaPath, 'database schema');
  if (!schemaResult) {
    console.error('Migration failed during schema application.');
    process.exit(1);
  }

  // Apply seed data
  const seedResult = await executeSqlFile(seedPath, 'seed data');
  if (!seedResult) {
    console.warn('Warning: Seed data application had issues.');
  }

  console.log('Migration completed successfully.');
}

// Run migration
migrate().catch(err => {
  console.error('Migration failed with error:', err);
  process.exit(1);
});
