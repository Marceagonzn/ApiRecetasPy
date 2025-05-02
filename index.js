import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta raíz actualizada
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Bienvenido a la API de Recetas Paraguay",
    endpoints: {
      healthcheck: "/healthcheck",
      todas_recetas: "/recetas",
      filtrar_por_pais: "/recetas?pais=paraguay",
      paises_disponibles: "/recetas/paises"
    },
    status: "active"
  });
});

// Healthcheck
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

// Endpoint principal de recetas con filtrado
app.get('/recetas', async (req, res) => {
  try {
    const { pais } = req.query;
    
    let query = 'SELECT * FROM recetas';
    let params = [];
    
    if (pais) {
      query += ' WHERE LOWER(pais) = LOWER($1)';
      params.push(pais);
    }

    const { rows } = await pool.query(query, params);
    
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    console.error('Error al obtener recetas:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Endpoint para obtener lista de países únicos
app.get('/recetas/paises', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT DISTINCT pais FROM recetas WHERE pais IS NOT NULL ORDER BY pais ASC'
    );
    
    res.json({
      success: true,
      count: rows.length,
      data: rows.map(item => item.pais)
    });
  } catch (err) {
    console.error('Error al obtener países:', err);
    res.status(500).json({
      success: false,
      error: 'Error al obtener lista de países'
    });
  }
});

// Rutas de administración (opcional, si las necesitas)
app.post('/admin/recetas', async (req, res) => {
  const { auth } = req.headers;
  if (auth !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: 'No autorizado' });
  }

  const { titulo, ingredientes, instrucciones, pais } = req.body;

  if (!titulo || !ingredientes || !instrucciones || !pais) {
    return res.status(400).json({ 
      error: 'Faltan campos obligatorios',
      campos_requeridos: ['titulo', 'ingredientes', 'instrucciones', 'pais']
    });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO recetas (titulo, ingredientes, instrucciones, pais) VALUES ($1, $2, $3, $4) RETURNING *',
      [titulo, ingredientes, instrucciones, pais]
    );
    res.status(201).json({ 
      success: true, 
      data: rows[0]
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    rutas_validas: ["/", "/healthcheck", "/recetas", "/recetas/paises"]
  });
});

// Iniciar servidor
app.listen(PORT, HOST, () => {
  console.log(`
  🚀 Servidor API RecetasPY funcionando en http://${HOST}:${PORT}
  ├─ Healthcheck: http://${HOST}:${PORT}/healthcheck
  ├─ Todas recetas: http://${HOST}:${PORT}/recetas
  ├─ Filtro por país: http://${HOST}:${PORT}/recetas?pais=paraguay
  └─ Paises disponibles: http://${HOST}:${PORT}/recetas/paises
  `);
});