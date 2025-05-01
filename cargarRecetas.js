import { config } from "dotenv";
import pg from "pg";
import fs from "fs";

config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL + "?sslmode=require",
  ssl: { rejectUnauthorized: false }
});

const recetas = JSON.parse(fs.readFileSync("recetas.json", "utf8"));

async function cargarRecetas() {
  try {
    await pool.query('BEGIN'); // Inicia transacción

    for (const receta of recetas) {
      await pool.query(
        `INSERT INTO recetas (nombre, pais, ingredientes, preparacion, tiempo, dificultad, imagen)
         VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7)`, // Conversión explícita a jsonb
        [
          receta.nombre,
          receta.pais,
          JSON.stringify(receta.ingredientes), // Convierte el array a string JSON
          receta.preparacion,
          receta.tiempo,
          receta.dificultad,
          receta.imagen
        ]
      );
    }

    await pool.query('COMMIT');
    console.log("✅ Recetas cargadas con éxito");
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error("❌ Error al cargar recetas:", error.message);
  } finally {
    await pool.end();
  }
}

cargarRecetas();