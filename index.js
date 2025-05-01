import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

// Configuración de middlewares (IMPORTANTE: Deben ir primero)
app.use(cors({
  origin: '*', // Cambia esto en producción a tu dominio específico
  methods: ['GET', 'OPTIONS']
}));
app.use(express.json());

// Health Check mejorado
app.get('/healthcheck', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'healthy',
      db: 'connected',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('❌ Healthcheck failed:', err);
    res.status(500).json({
      status: 'unhealthy',
      error: err.message
    });
  }
});

// Endpoint GET /recetas (VERSIÓN DEFINITIVA)
app.get('/recetas', async (req, res) => {
  try {
    console.log('🔍 Iniciando consulta de recetas...');
    
    const { rows } = await pool.query(`
      SELECT 
        id,
        nombre,
        pais,
        COALESCE(ingredientes::text, '[]') AS ingredientes,
        COALESCE(preparacion, '') AS preparacion,
        COALESCE(tiempo, '') AS tiempo,
        COALESCE(dificultad, 'Media') AS dificultad,
        imagen
      FROM recetas
      ORDER BY id ASC
    `);

    if (!rows || rows.length === 0) {
      console.warn('⚠️ Consulta exitosa pero 0 recetas encontradas');
      return res.status(200).json({
        success: true,
        count: 0,
        message: 'No hay recetas disponibles',
        data: []
      });
    }

    // Convertir ingredientes de string JSON a objeto
    const formattedRows = rows.map(row => ({
      ...row,
      ingredientes: JSON.parse(row.ingredientes)
    }));

    console.log(`✅ ${formattedRows.length} recetas obtenidas`);
    
    res.status(200).json({
      success: true,
      count: formattedRows.length,
      data: formattedRows
    });

  } catch (error) {
    console.error('❌ Error en GET /recetas:', {
      message: error.message,
      stack: error.stack
    });
    
    res.status(500).json({
      success: false,
      error: 'Error al obtener recetas',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Ruta de ejemplo adicional
app.get('/', (req, res) => {
  res.send('API de Recetas Paraguayas 🚀');
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('🔥 Error no manejado:', err);
  res.status(500).json({ 
    success: false,
    error: 'Error interno del servidor'
  });
});

// Inicio del servidor
app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor escuchando en http://${HOST}:${PORT}`);
  console.log(`• Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`• Healthcheck: http://${HOST}:${PORT}/healthcheck`);
  console.log(`• Endpoint recetas: http://${HOST}:${PORT}/recetas`);
});