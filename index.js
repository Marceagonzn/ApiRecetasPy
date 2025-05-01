import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración mejorada
app.use(cors());
app.use(express.json());

// Verificación asíncrona de la conexión a DB
const startServer = async () => {
  try {
    // Testear conexión a DB
    await pool.query('SELECT 1');
    console.log('✅ Conexión a PostgreSQL verificada');

    // Rutas
    app.get('/', (req, res) => {
      res.send('API de Recetas Paraguayas 🚀');
    });

    app.get('/recetas', async (req, res) => {
      try {
        const { rows } = await pool.query('SELECT * FROM recetas');
        res.json(rows);
      } catch (err) {
        console.error('Error en GET /recetas:', err);
        res.status(500).json({ error: 'Error al obtener recetas' });
      }
    });

    // Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
    });

  } catch (dbError) {
    console.error('❌ Error crítico de conexión a DB:', dbError);
    process.exit(1); // Terminar proceso con error
  }
};

// Iniciar la aplicación
startServer();

// Manejo de errores global
process.on('unhandledRejection', (err) => {
  console.error('Error no manejado:', err);
});