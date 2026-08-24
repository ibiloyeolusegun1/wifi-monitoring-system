import pool from "./database";

export async function testDatabaseConnection(): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query("SELECT NOW()");
    console.log("PostgreSQL database connected successfully.");
  } finally {
    client.release();
  }
}