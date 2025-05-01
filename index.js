import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();

// Configuración de puerto y host para producción
const PORT = process.env.PORT || 3000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

// Middlewares esenciales (DEBEN IR PRIMERO)
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://tudominio.com' 
    : '*',
  methods: ['GET', 'OPTIONS']
}));
app.use(express.json());

// Logging de solicitudes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health Check mejorado
app.get('/healthcheck', async (req, res) => {
  try {
    const dbCheck = await pool.query('SELECT COUNT(*) FROM recetas');
    res.json({
      status: 'healthy',
      db: 'connected',
      recetas_count: dbCheck.rows[0].count,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (err) {
    console.error('❌ Healthcheck DB Error:', err);
    res.status(500).json({
      status: 'unhealthy',
      error: 'Database connection failed'
    });
  }
});

// Endpoint GET /recetas (Versión Final)
app.get('/recetas', async (req, res) => {
  try {
    console.log('📡 Consultando recetas...');
    
    const { rows } = await pool.query(`
      SELECT 
        id,
        nombre,
        pais,
        COALESCE(ingredientes::jsonb, '[]'::jsonb) AS ingredientes,
        COALESCE(preparacion, '') AS preparacion,
        COALESCE(tiempo, '') AS tiempo,
        COALESCE(dificultad, 'Media') AS dificultad,
        imagen
      FROM recetas
      ORDER BY id ASC
    `);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron recetas'
      });
    }

    console.log(`✅ Enviando ${rows.length} recetas`);
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });

  } catch (error) {
    console.error('💥 Error en /recetas:', {
      message: error.message,
      stack: error.stack.split('\n')[0]
    });
    
    res.status(500).json({
      success: false,
      error: 'Error interno al obtener recetas'
    });
  }
});

// Ruta raíz
app.get('/', (req, res) => {
  res.send(`
    <h1>API de Recetas Paraguayas</h1>
    <ul>
      <li><a href="/healthcheck">Health Check</a></li>
      <li><a href="/recetas">Listado de Recetas</a></li>
    </ul>
  `);
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('🔥 Error no capturado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Inicio del servidor
const server = app.listen(PORT, HOST, () => {
  console.log(`
  🚀 Servidor activo en http://${HOST}:${PORT}
  ├─ Entorno: ${process.env.NODE_ENV || 'development'}
  ├─ Healthcheck: /healthcheck
  └─ Endpoint Recetas: /recetas
  `);
});

// Manejo de cierre
process.on('SIGTERM', () => {
  console.log('🛑 Recibida señal de terminación');
  server.close(() => {
    console.log('👋 Servidor cerrado');
    pool.end();
    process.exit(0);
  });
});