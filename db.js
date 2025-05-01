import pg from "pg";
import { config } from "dotenv";

config(); // Carga las variables de entorno

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL + "?sslmode=require", // ← Añade esto
  ssl: { rejectUnauthorized: false }
});

export default pool;
