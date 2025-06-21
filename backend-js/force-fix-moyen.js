const { Pool } = require('pg');

const pool = new Pool({
  host: 'dpg-d13af43uibrs7380cfl0-a.frankfurt-postgres.render.com',
  port: 5432,
  database: 'aifb_a2h0',
  user: 'aifb',
  password: 'YD73qk3D1tRwEwNGcn6L3hXyEHxex00a',
  ssl: true
});

async function forceFixMoyen() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Recherche de toutes les valeurs "Moyen" dans la base de données...');
    
    // Rechercher dans toutes les tables
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `;
    
    const tablesResult = await client.query(tablesQuery);
    const tables = tablesResult.rows.map(row => row.table_name);
    
    console.log('📋 Tables trouvées:', tables);
    
    for (const table of tables) {
      console.log(`\n🔍 Vérification de la table: ${table}`);
      
      // Vérifier si la table a une colonne difficulty
      const columnsQuery = `
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1 
        AND table_schema = 'public'
      `;
      
      const columnsResult = await client.query(columnsQuery, [table]);
      const columns = columnsResult.rows;
      
      console.log(`   Colonnes:`, columns.map(c => `${c.column_name} (${c.data_type})`));
      
      // Chercher des valeurs "Moyen" dans toutes les colonnes textuelles
      for (const column of columns) {
        if (['character varying', 'text', 'varchar'].includes(column.data_type)) {
          const checkQuery = `
            SELECT COUNT(*) as count 
            FROM "${table}" 
            WHERE "${column.column_name}"::text ILIKE '%moyen%'
          `;
          
          try {
            const checkResult = await client.query(checkQuery);
            const count = parseInt(checkResult.rows[0].count);
            
            if (count > 0) {
              console.log(`   ⚠️  Trouvé ${count} valeurs contenant "moyen" dans ${column.column_name}`);
              
              // Afficher quelques exemples
              const examplesQuery = `
                SELECT "${column.column_name}" 
                FROM "${table}" 
                WHERE "${column.column_name}"::text ILIKE '%moyen%'
                LIMIT 5
              `;
              
              const examplesResult = await client.query(examplesQuery);
              console.log(`   Exemples:`, examplesResult.rows.map(r => r[column.column_name]));
              
              // Si c'est la colonne difficulty, corriger
              if (column.column_name === 'difficulty') {
                console.log(`   🔧 Correction des valeurs "Moyen" vers "Intermédiaire"...`);
                
                const updateQuery = `
                  UPDATE "${table}" 
                  SET "${column.column_name}" = 'Intermédiaire' 
                  WHERE "${column.column_name}"::text ILIKE '%moyen%'
                `;
                
                const updateResult = await client.query(updateQuery);
                console.log(`   ✅ ${updateResult.rowCount} valeurs corrigées`);
              }
            }
          } catch (error) {
            console.log(`   ❌ Erreur lors de la vérification de ${column.column_name}:`, error.message);
          }
        }
      }
    }
    
    console.log('\n✅ Vérification terminée!');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

forceFixMoyen(); 