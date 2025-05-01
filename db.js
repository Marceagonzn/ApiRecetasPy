import { Pool } from 'pg';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

// Configuración condicional para desarrollo/producción
const poolConfig = process.env.DATABASE_URL 
  ? {
      // Configuración para Railway (producción)
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    } 
  : {
      // Configuración local (solo para desarrollo)
      host: 'hopper.proxy.rlwy.net',
      port: 48766,
      user: 'postgres',       // Cambiar según tu configuración local
      password: 'FfSTbRBsqEZKodCAREjPCPpAsLKTvaJh', // Cambiar según tu configuración local
      database: 'railway'   // Nombre de tu DB local
    };

// Crear el pool de conexiones
const pool = new Pool(poolConfig);

// Verificación de conexión con manejo de errores detallado
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ Conexión a PostgreSQL exitosa');
    console.log(`🔗 Conectado a: ${process.env.DATABASE_URL ? 'Railway' : 'Base de datos local'}`);
  })
  .catch(err => {
    console.error('❌ Error de conexión a PostgreSQL:');
    console.error('Código:', err.code);
    console.error('Dirección:', err.address || 'localhost (por defecto)');
    console.error('Puerto:', err.port || 5432);
    console.error('Mensaje:', err.message);
    
    // Sugerencias basadas en el error
    if (err.code === 'ECONNREFUSED') {
      console.log('\n🔧 Posibles soluciones:');
      console.log('1. Verifica que PostgreSQL esté corriendo localmente (si estás en desarrollo)');
      console.log('2. Revisa la variable DATABASE_URL en Railway (si estás en producción)');
      console.log('3. Comprueba que el puerto 5432 esté accesible');
    }
  });

export default pool;