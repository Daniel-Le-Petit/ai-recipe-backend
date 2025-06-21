const { Client } = require('pg');

async function fixAllDifficulties() {
  const client = new Client({
    host: 'dpg-d13af43uibrs7380cfl0-a.frankfurt-postgres.render.com',
    port: 5432,
    database: 'aifb_a2h0',
    user: 'aifb',
    password: 'YD73qk3D1tRwEwNGcn6L3hXyEHxex00a',
    ssl: true
  });

  await client.connect();
  await client.query(`
    UPDATE recipies
    SET difficulty = 'Facile'
    WHERE difficulty IS NULL OR difficulty NOT IN ('Facile', 'Intermédiaire', 'Difficile');
  `);
  const res = await client.query('SELECT DISTINCT difficulty FROM recipies');
  console.log('Difficultés restantes:', res.rows);
  await client.end();
}

fixAllDifficulties();