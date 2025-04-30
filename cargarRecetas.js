import { config } from "dotenv";
import pg from "pg";
import fs from "fs";

config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const recetas = JSON.parse(fs.readFileSync("recetas.json", "utf8"));

async function cargarRecetas() {
  try {
    for (const receta of recetas) {
      await pool.query(
        `INSERT INTO recetas (nombre, pais, ingredientes, preparacion, tiempo, dificultad, imagen)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          receta.nombre,
          receta.pais,
          receta.ingredientes,
          receta.preparacion,
          receta.tiempo,
          receta.dificultad,
          receta.imagen
        ]
      );
    }
    console.log("Recetas cargadas con éxito ✅");
  } catch (error) {
    console.error("Error al cargar recetas:", error);
  } finally {
    await pool.end();
  }
}

cargarRecetas();
