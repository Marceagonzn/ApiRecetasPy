// test-insert.js
import pool from './db.js';

async function testInsert() {
  try {
    const result = await pool.query(
      `INSERT INTO recetas (nombre, pais, ingredientes) 
       VALUES ($1, $2, $3) RETURNING *`,
      ['Prueba', 'Paraguay', JSON.stringify(['ing1', 'ing2'])]
    );
    console.log('✅ Receta insertada:', result.rows[0]);
  } catch (error) {
    console.error('❌ Error al insertar:', error);
  } finally {
    await pool.end();
  }
}

testInsert();