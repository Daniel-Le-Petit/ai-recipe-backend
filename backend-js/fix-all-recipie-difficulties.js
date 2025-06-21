const { Pool } = require('pg');

const pool = new Pool({
  host: 'dpg-d13af43uibrs7380cfl0-a.frankfurt-postgres.render.com',
  port: 5432,
  database: 'aifb_a2h0',
  user: 'aifb',
  password: 'YD73qk3D1tRwEwNGcn6L3hXyEHxex00a',
  ssl: true
});

async function fixAllRecipieDifficulties() {
  const client = await pool.connect();
  try {
    console.log('🔍 Recherche de toutes les tables commençant par recipie ou recipe...');
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND (table_name ILIKE 'recipie%' OR table_name ILIKE 'recipe%')
    `;
    const tablesResult = await client.query(tablesQuery);
    const tables = tablesResult.rows.map(row => row.table_name);
    if (tables.length === 0) {
      console.log('❌ Aucune table trouvée.');
      return;
    }
    console.log('📋 Tables trouvées:', tables);
    for (const table of tables) {
      console.log(`\n🔍 Table: ${table}`);
      // Vérifier la structure
      const columnsQuery = `
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1 
        AND table_schema = 'public'
      `;
      const columnsResult = await client.query(columnsQuery, [table]);
      const columns = columnsResult.rows;
      // Chercher une colonne difficulty
      const diffCol = columns.find(col => col.column_name.toLowerCase() === 'difficulty');
      if (!diffCol) {
        console.log('   ⏩ Pas de colonne difficulty');
        continue;
      }
      // Afficher toutes les valeurs distinctes
      const valuesQuery = `SELECT DISTINCT "difficulty" FROM "${table}"`;
      const valuesResult = await client.query(valuesQuery);
      console.log('   Valeurs distinctes difficulty:', valuesResult.rows.map(r => r.difficulty));
      // Corriger les valeurs "Moyen"
      const updateQuery = `UPDATE "${table}" SET "difficulty" = 'Intermédiaire' WHERE "difficulty" ILIKE '%moyen%'`;
      const updateResult = await client.query(updateQuery);
      if (updateResult.rowCount > 0) {
        console.log(`   ✅ ${updateResult.rowCount} valeurs "Moyen" corrigées vers "Intermédiaire"`);
      } else {
        console.log('   ✅ Aucune valeur "Moyen" à corriger');
      }
      // Afficher à nouveau les valeurs distinctes
      const afterValuesResult = await client.query(valuesQuery);
      console.log('   Valeurs difficulty après correction:', afterValuesResult.rows.map(r => r.difficulty));
    }
    console.log('\n✅ Correction terminée !');
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

fixAllRecipieDifficulties(); 