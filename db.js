import { Pool } from 'pg';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

// Configuración de la conexión
const pool = new Pool({
<<<<<<< HEAD
  connectionString: process.env.DATABASE_URL, // Usará la variable de Railway en producción
  ssl: {
    rejectUnauthorized: false // Necesario para Railway
  }
=======
  connectionString: process.env.DATABASE_URL + "?sslmode=require", // ← Añade esto
  ssl: { rejectUnauthorized: false }
>>>>>>> 17c8d52689c4decb2965ef696684d91267cdddcc
});

// Verificación de conexión (opcional pero recomendado)
pool.query('SELECT NOW()')
  .then(() => console.log('✅ Conexión a PostgreSQL exitosa'))
  .catch(err => console.error('❌ Error de conexión:', err));

export default pool;