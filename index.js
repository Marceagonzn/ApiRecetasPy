import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de middleware (DEBE IR AL INICIO)
app.use(cors({
  origin: '*' // O especifica tu dominio frontend ej: 'https://tufrontend.com'
}));
app.use(express.json());

// Verificación de conexión a DB y rutas
const startServer = async () => {
  try {
    // Testear conexión a DB
    await pool.query('SELECT 1');
    console.log('✅ Conexión a PostgreSQL verificada');

    // Ruta de prueba
    app.get('/', (req, res) => {
      res.send('API de Recetas Paraguayas 🚀');
    });

    // Ruta GET /recetas MEJORADA
    app.get('/recetas', async (req, res) => {
      try {
        console.log('📦 Intentando obtener recetas...'); // Log de depuración
        const { rows } = await pool.query('SELECT * FROM recetas');
        console.log(`✅ Encontradas ${rows.length} recetas`); // Log de depuración
        
        // Asegurar formato de respuesta
        res.status(200).json({
          success: true,
          count: rows.length,
          data: rows
        });
      } catch (err) {
        console.error('❌ Error en GET /recetas:', err);
        res.status(500).json({ 
          success: false,
          error: 'Error al obtener recetas',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }
    });

    // Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
    });

  } catch (dbError) {
    console.error('❌ Error crítico de conexión a DB:', dbError);
    process.exit(1);
  }
};

startServer();