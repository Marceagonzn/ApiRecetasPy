import { Pool } from 'pg';
import fs from 'fs/promises';
import { config } from 'dotenv';

config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function cargarRecetas() {
  const client = await pool.connect();
  try {
    const data = await fs.readFile('recetas.json', 'utf8');
    const recetas = JSON.parse(data);

    await client.query('BEGIN');
    
    for (const [i, receta] of recetas.entries()) {
      try {
        await client.query(
          `INSERT INTO recetas 
          (nombre, pais, ingredientes, preparacion, tiempo, dificultad, imagen)
          VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7)`,
          [
            receta.nombre,
            receta.pais,
            JSON.stringify(receta.ingredientes),
            receta.preparacion,
            receta.tiempo,
            receta.difficulty || 'Media', // Valor por defecto si no existe
            receta.imagen
          ]
        );
        console.log(`✅ Receta ${i+1}/${recetas.length} insertada`);
      } catch (error) {
        console.error(`❌ Error en receta "${receta.nombre}":`, error.message);
        continue;
      }
    }
    
    await client.query('COMMIT');
    console.log('🎉 Todas las recetas se cargaron correctamente');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('🔥 Error crítico:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

cargarRecetas();