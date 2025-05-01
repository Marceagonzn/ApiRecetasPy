import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0'; // Obligatorio para producción

// 1. Middlewares esenciales (DEBEN ir primero)
app.use(cors());
app.use(express.json());

// 2. Ruta raíz OBLIGATORIA (actualizada con nuevos endpoints)
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Bienvenido a la API de Recetas",
    endpoints: {
      healthcheck: "/healthcheck",
      recetas: "/recetas",
      recetasPorPais: "/recetas/pais/:pais",
      paisesDisponibles: "/recetas/paises"
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

// 4. Endpoint de recetas (mejorado con filtrado opcional por país)
app.get('/recetas', async (req, res) => {
  try {
    // Soporte para filtrado por país mediante query parameter
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
      error: err.message
    });
  }
});

// 5. Endpoint para obtener recetas por país
app.get('/recetas/pais/:pais', async (req, res) => {
  try {
    const { pais } = req.params;
    
    // Validación básica del parámetro
    if (!pais || typeof pais !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Debe proporcionar un país válido'
      });
    }

    const { rows } = await pool.query(
      'SELECT * FROM recetas WHERE LOWER(pais) = LOWER($1)',
      [pais]
    );

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    console.error('Error al filtrar recetas por país:', err);
    res.status(500).json({
      success: false,
      error: 'Error al obtener recetas por país'
    });
  }
});

// 6. Endpoint para obtener la lista de países disponibles
app.get('/recetas/paises', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT DISTINCT pais FROM recetas WHERE pais IS NOT NULL ORDER BY pais ASC'
    );
    
    const paises = rows.map(item => item.pais);
    
    res.json({
      success: true,
      count: paises.length,
      data: paises
    });
  } catch (err) {
    console.error('Error al obtener lista de países:', err);
    res.status(500).json({
      success: false,
      error: 'Error al obtener lista de países'
    });
  }
});

// 7. Rutas privadas para administrador (actualizadas para incluir país)
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
      message: 'Receta agregada correctamente',
      data: rows[0]
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

app.delete('/admin/recetas/:id', async (req, res) => {
  const { auth } = req.headers;
  if (auth !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: 'No autorizado' });
  }

  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM recetas WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
    res.json({ 
      success: true, 
      message: 'Receta eliminada correctamente',
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// 8. Manejo de rutas no existentes (actualizado con nuevos endpoints)
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    rutas_validas: [
      "/", 
      "/healthcheck", 
      "/recetas", 
      "/recetas/pais/:pais", 
      "/recetas/paises"
    ]
  });
});

// 9. Inicio del servidor
app.listen(PORT, HOST, () => {
  console.log(`
  🚀 Servidor funcionando en http://${HOST}:${PORT}
  ├─ Healthcheck: http://${HOST}:${PORT}/healthcheck
  ├─ Todas las recetas: http://${HOST}:${PORT}/recetas
  ├─ Recetas por país: http://${HOST}:${PORT}/recetas/pais/:pais
  └─ Paises disponibles: http://${HOST}:${PORT}/recetas/paises
  `);
});