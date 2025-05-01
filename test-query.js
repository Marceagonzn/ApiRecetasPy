import pool from './db.js';

async function testQuery() {
  try {
    const { rows } = await pool.query('SELECT * FROM recetas LIMIT 5');
    console.log('📦 Recetas encontradas:', rows);
  } catch (error) {
    console.error('❌ Error al consultar:', error);
  } finally {
    await pool.end();
  }
}

testQuery();