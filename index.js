import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración esencial (DEBE IR PRIMERO)
app.use(cors());
app.use(express.json());

// Middleware de logs para todas las peticiones
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// Ruta de prueba básica
app.get('/healthcheck', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Ruta principal de recetas
app.get('/recetas', async (req, res) => {
  try {
    console.log('🔍 Ejecutando query para obtener recetas...');
    const { rows } = await pool.query('SELECT * FROM recetas');
    console.log(`✅ Encontradas ${rows.length} recetas`);
    
    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('❌ Error en GET /recetas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener recetas'
    });
  }
});

// Manejo de errores centralizado
app.use((err, req, res, next) => {
  console.error('🔥 Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});

// Manejo de cierre adecuado
process.on('SIGTERM', () => {
  console.log('🛑 Recibido SIGTERM. Cerrando servidor...');
  server.close(() => {
    console.log('👋 Servidor cerrado');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  console.error('⚠️ Unhandled Rejection:', err);
});