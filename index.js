import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

// Configuración 100% compatible con Railway
const app = express();
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// Conexión a DB con manejo de errores extremo
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    sslmode: 'require'
  },
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000
});

// Middlewares con protección máxima
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS']
}));
app.use(express.json({ limit: '10mb' }));

// Healthcheck de nivel militar
app.get('/healthcheck', async (req, res) => {
  try {
    const dbResult = await pool.query('SELECT NOW()');
    res.json({
      status: 'OPERATIONAL',
      database: dbResult.rows[0].now,
      serverTime: new Date(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (dbError) {
    console.error('‼️ Critical DB Failure:', dbError);
    res.status(503).json({
      status: 'DATABASE_FAILURE',
      error: dbError.message
    });
  }
});

// Endpoint de recetas a prueba de balas
app.get('/recetas', async (req, res) => {
  try {
    console.log('🔍 Iniciando consulta a DB...');
    const startTime = Date.now();
    
    const { rows } = await pool.query(`
      SELECT * FROM recetas 
      ORDER BY id ASC
      LIMIT 100  -- Prevención de sobrecarga
    `);

    const duration = Date.now() - startTime;
    console.log(`✅ Consulta exitosa (${duration}ms): ${rows.length} recetas`);

    res.json({
      status: 'SUCCESS',
      executionTime: `${duration}ms`,
      count: rows.length,
      data: rows
    });

  } catch (error) {
    console.error('💥 EXPLOSION EN /recetas:', {
      error: error.message,
      stack: error.stack.split('\n')[0],
      timestamp: new Date()
    });

    res.status(500).json({
      status: 'SYSTEM_FAILURE',
      errorCode: 'RECETAS_QUERY_FAILED',
      timestamp: new Date().toISOString()
    });
  }
});

// Inicio del servidor con triple verificación
const server = app.listen(PORT, HOST, () => {
  console.log(`
  🚀 BOLT SERVER RUNNING
  ├─ Port: ${PORT}
  ├─ Env: ${process.env.NODE_ENV || 'development'}
  ├─ DB: ${process.env.DATABASE_URL ? 'CONFIGURED' : 'MISSING!'}
  └─ Ready: http://${HOST}:${PORT}/healthcheck
  `);
});

// Manejo de errores catastróficos
process.on('unhandledRejection', (err) => {
  console.error('☢️ UNHANDLED REJECTION:', err);
  process.exit(1);
});

server.on('error', (err) => {
  console.error('💣 SERVER ERROR:', err);
  process.exit(1);
});