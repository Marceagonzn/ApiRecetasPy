import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // para leer JSON

// Ruta para obtener todas las recetas
app.get("/recetas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM recetas");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener recetas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta para agregar una nueva receta
app.post("/recetas", async (req, res) => {
  const { nombre, pais, ingredientes, preparacion, tiempo, dificultad, imagen } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO recetas (nombre, pais, ingredientes, preparacion, tiempo, dificultad, imagen)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [nombre, pais, ingredientes, preparacion, tiempo, dificultad, imagen]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear receta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
