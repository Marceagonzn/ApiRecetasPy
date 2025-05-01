import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0'; // Obligatorio para producción

// 1. Middlewares esenciales (DEBEN ir primero)
app.use(cors());
app.use(express.json());

// 2. Ruta raíz OBLIGATORIA
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Bienvenido a la API de Recetas",
    endpoints: {
      healthcheck: "/healthcheck",
      recetas: "/recetas"
    },
    status: "active"
  });
});

// 3. Healthcheck mejorado
app.get('/healthcheck', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'online',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
});

// 4. Endpoint de recetas
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
      error: err.message
    });
  }
});

// 5. Manejo de rutas no existentes (DEBE ir al final)
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    rutas_validas: ["/", "/healthcheck", "/recetas"]
  });
});

// 6. Inicio del servidor
app.listen(PORT, HOST, () => {
  console.log(`
  🚀 Servidor funcionando en http://${HOST}:${PORT}
  ├─ Healthcheck: http://${HOST}:${PORT}/healthcheck
  └─ Recetas: http://${HOST}:${PORT}/recetas
  `);
});