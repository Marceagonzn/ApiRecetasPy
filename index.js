import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();

// Configuración de puerto para Railway
const PORT = process.env.PORT || 3000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check
app.get('/healthcheck', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      status: 'healthy',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', error: err.message });
  }
});

// Resto de tus rutas...

// Inicio del servidor
app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor corriendo en http://${HOST}:${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});