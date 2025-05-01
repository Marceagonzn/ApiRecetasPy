import pg from "pg";
import { config } from "dotenv";

config(); // Carga las variables de entorno

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { 
    rejectUnauthorized: false,
    sslmode: 'require' // Esta línea es crucial para Railway
  }
});

export default pool;
