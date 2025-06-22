import postgres from 'postgres'

const connectionString = "postgresql://postgres.moqdnzgimdlrffxgnoxg:B0a307bd0d!@aws-0-eu-north-1.pooler.supabase.com:5432/postgres"

console.log(connectionString, "mazna")

const sql = postgres(connectionString)

async function testConnection() {
    try {
      const result = await sql`SELECT NOW()`;
      console.log('Connection successful:', result);
    } catch (err) {
      console.error('Connection failed:', err);
    } finally {
      await sql.end();
    }
  }
  
  testConnection();

export default sql