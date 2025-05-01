import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración CORS más estricta (necesaria para React Native)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Ruta mejorada para obtener recetas
app.get("/recetas", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        id,
        nombre,
        pais,
        ingredientes::text AS ingredientes,  -- Convertir JSONB a texto
        preparacion,
        tiempo,
        dificultad,
        imagen
      FROM recetas
    `);
    
    // Formatear para React Native
    const recetasFormateadas = rows.map(receta => ({
      ...receta,
      ingredientes: JSON.parse(receta.ingredientes || '[]')  // Parsear a array
    }));

    res.json(recetasFormateadas);
  } catch (error) {
    console.error("Error al obtener recetas:", error);
    res.status(500).json({ 
      error: "Error interno del servidor",
      detalles: error.message  // Solo en desarrollo
    });
  }
});

// Ruta POST con validación
app.post("/recetas", async (req, res) => {
  const { nombre, imagen } = req.body;
  
  // Validación básica
  if (!nombre || !imagen) {
    return res.status(400).json({ error: "Nombre e imagen son requeridos" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO recetas (nombre, pais, ingredientes, preparacion, tiempo, dificultad, imagen)
       VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7) 
       RETURNING *`,
      [
        nombre,
        req.body.pais || 'Paraguay',  // Valor por defecto
        JSON.stringify(req.body.ingredientes || []),  // Asegurar array
        req.body.preparacion,
        req.body.tiempo,
        req.body.dificultad || 'Media',  // Valor por defecto
        imagen
      ]
    );
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error al crear receta:", error);
    res.status(500).json({ 
      error: "Error al guardar receta",
      sqlError: error.message  // Solo en desarrollo
    });
  }
});

// Ruta de salud (para pruebas)
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});