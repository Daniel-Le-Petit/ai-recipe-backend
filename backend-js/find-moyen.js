const { Pool } = require('pg');

const pool = new Pool({
  host: 'dpg-d13af43uibrs7380cfl0-a.frankfurt-postgres.render.com',
  port: 5432,
  database: 'aifb_a2h0',
  user: 'aifb',
  password: 'YD73qk3D1tRwEwNGcn6L3hXyEHxex00a',
  ssl: true
});

async function findMoyen() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Recherche exhaustive de "Moyen" dans toute la base de données...');
    
    // 1. Obtenir toutes les tables
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    
    const tablesResult = await client.query(tablesQuery);
    const tables = tablesResult.rows.map(row => row.table_name);
    
    console.log(`📋 ${tables.length} tables trouvées`);
    
    let totalMoyenFound = 0;
    
    // 2. Vérifier chaque table
    for (const table of tables) {
      console.log(`\n🔍 Vérification de: ${table}`);
      
      try {
        // Obtenir toutes les colonnes de la table
        const columnsQuery = `
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = $1 
          AND table_schema = 'public'
          ORDER BY ordinal_position
        `;
        
        const columnsResult = await client.query(columnsQuery, [table]);
        const columns = columnsResult.rows;
        
        // Compter les lignes
        const countQuery = `SELECT COUNT(*) as count FROM "${table}"`;
        const countResult = await client.query(countQuery);
        const rowCount = parseInt(countResult.rows[0].count);
        
        if (rowCount === 0) {
          console.log(`   📭 Table vide (${rowCount} lignes)`);
          continue;
        }
        
        console.log(`   📊 ${rowCount} lignes`);
        
        // Vérifier chaque colonne textuelle
        for (const column of columns) {
          if (['character varying', 'text', 'varchar', 'jsonb', 'json'].includes(column.data_type)) {
            try {
              const moyenQuery = `
                SELECT COUNT(*) as count
                FROM "${table}"
                WHERE "${column.column_name}"::text ILIKE '%moyen%'
              `;
              
              const moyenResult = await client.query(moyenQuery);
              const moyenCount = parseInt(moyenResult.rows[0].count);
              
              if (moyenCount > 0) {
                totalMoyenFound += moyenCount;
                console.log(`   ⚠️  TROUVÉ ${moyenCount} valeurs "Moyen" dans ${column.column_name}`);
                
                // Afficher les détails
                const detailsQuery = `
                  SELECT id, "${column.column_name}"
                  FROM "${table}"
                  WHERE "${column.column_name}"::text ILIKE '%moyen%'
                  LIMIT 5
                `;
                
                const detailsResult = await client.query(detailsQuery);
                detailsResult.rows.forEach((row, index) => {
                  const value = row[column.column_name];
                  console.log(`     ${index + 1}. ID: ${row.id}, ${column.column_name}: "${value}"`);
                });
                
                // Corriger immédiatement
                console.log(`   🔧 Correction en cours...`);
                
                if (column.data_type === 'jsonb' || column.data_type === 'json') {
                  // Pour JSON, remplacer dans le texte JSON
                  const updateQuery = `
                    UPDATE "${table}"
                    SET "${column.column_name}" = REPLACE("${column.column_name}"::text, '"Moyen"', '"Intermédiaire"')::jsonb
                    WHERE "${column.column_name}"::text ILIKE '%moyen%'
                  `;
                  
                  try {
                    const updateResult = await client.query(updateQuery);
                    console.log(`   ✅ ${updateResult.rowCount} valeurs JSON corrigées`);
                  } catch (jsonError) {
                    console.log(`   ❌ Erreur JSON: ${jsonError.message}`);
                  }
                } else {
                  // Pour les colonnes texte normales
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
              console.log(`   ❌ Erreur avec ${column.column_name}: ${error.message}`);
            }
          }
        }
        
      } catch (error) {
        console.log(`   ❌ Erreur avec la table ${table}: ${error.message}`);
      }
    }
    
    console.log(`\n📊 RÉSUMÉ: ${totalMoyenFound} valeurs "Moyen" trouvées et corrigées au total`);
    
    if (totalMoyenFound === 0) {
      console.log('✅ Aucune valeur "Moyen" trouvée dans toute la base de données');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

findMoyen();
