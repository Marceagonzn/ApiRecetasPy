import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();

// Configuración automática para Railway
const PORT = process.env.PORT || 8080; // Usa 8080 como fallback
const HOST = '0.0.0.0'; // Obligatorio para producción

// Middlewares esenciales
app.use(cors());
app.use(express.json());

// Healthcheck mejorado para Railway
app.get('/healthcheck', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      status: 'healthy',
      server: 'online',
      database: 'connected',
      port: PORT
    });
  } catch (err) {
    res.status(500).json({
      status: 'unhealthy',
      error: err.message
    });
  }
});

// Endpoint de recetas
app.get('/recetas', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM recetas');
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Database error'
    });
  }
});

// Iniciar servidor
app.listen(PORT, HOST, () => {
  console.log(`
  🚀 Servidor listo en ${HOST}:${PORT}
  ├─ Modo: ${process.env.NODE_ENV || 'development'}
  ├─ Healthcheck: http://${HOST}:${PORT}/healthcheck
  └─ Recetas: http://${HOST}:${PORT}/recetas
  `);
});