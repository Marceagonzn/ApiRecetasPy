import { Pool } from 'pg';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

// Configuración de la conexión
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Usará la variable de Railway en producción
  ssl: {
    rejectUnauthorized: false // Necesario para Railway
  }
});

// Verificación de conexión (opcional pero recomendado)
pool.query('SELECT NOW()')
  .then(() => console.log('✅ Conexión a PostgreSQL exitosa'))
  .catch(err => console.error('❌ Error de conexión:', err));

export default pool;