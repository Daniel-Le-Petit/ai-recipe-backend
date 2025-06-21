const { Pool } = require('pg');

const pool = new Pool({
  host: 'dpg-d13af43uibrs7380cfl0-a.frankfurt-postgres.render.com',
  port: 5432,
  database: 'aifb_a2h0',
  user: 'aifb',
  password: 'YD73qk3D1tRwEwNGcn6L3hXyEHxex00a',
  ssl: true
});

async function checkAllRecipeTables() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Vérification de toutes les tables liées aux recettes...');
    
    // 1. Trouver toutes les tables qui contiennent "recipie" ou "recipe"
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND (table_name ILIKE '%recipie%' OR table_name ILIKE '%recipe%')
    `;
    
    const tablesResult = await client.query(tablesQuery);
    const recipeTables = tablesResult.rows.map(row => row.table_name);
    
    console.log('📋 Tables liées aux recettes trouvées:', recipeTables);
    
    // 2. Vérifier aussi les tables avec des colonnes difficulty
    const difficultyTablesQuery = `
      SELECT DISTINCT table_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      AND column_name ILIKE '%difficulty%'
    `;
    
    const difficultyTablesResult = await client.query(difficultyTablesQuery);
    const difficultyTables = difficultyTablesResult.rows.map(row => row.table_name);
    
    console.log('📋 Tables avec colonne difficulty:', difficultyTables);
    
    // 3. Combiner et dédupliquer
    const allTables = [...new Set([...recipeTables, ...difficultyTables])];
    console.log('📋 Toutes les tables à vérifier:', allTables);
    
    // 4. Vérifier chaque table
    for (const table of allTables) {
      console.log(`\n🔍 Vérification de la table: ${table}`);
      
      // Vérifier la structure
      const structureQuery = `
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1 
        AND table_schema = 'public'
        ORDER BY ordinal_position
      `;
      
      const structureResult = await client.query(structureQuery, [table]);
      console.log(`   Colonnes:`, structureResult.rows.map(c => `${c.column_name} (${c.data_type})`));
      
      // Compter les lignes
      const countQuery = `SELECT COUNT(*) as count FROM "${table}"`;
      const countResult = await client.query(countQuery);
      const rowCount = parseInt(countResult.rows[0].count);
      console.log(`   Nombre de lignes: ${rowCount}`);
      
      if (rowCount > 0) {
        // Chercher des colonnes difficulty
        const difficultyColumns = structureResult.rows.filter(col => 
          col.column_name.toLowerCase().includes('difficulty')
        );
        
        for (const col of difficultyColumns) {
          console.log(`   🔍 Vérification de la colonne: ${col.column_name}`);
          
          // Vérifier toutes les valeurs
          const valuesQuery = `
            SELECT "${col.column_name}", COUNT(*) as count
            FROM "${table}"
            GROUP BY "${col.column_name}"
            ORDER BY count DESC
          `;
          
          const valuesResult = await client.query(valuesQuery);
          console.log(`   Valeurs trouvées:`);
          valuesResult.rows.forEach(row => {
            const value = row[col.column_name] || 'NULL';
            console.log(`     "${value}": ${row.count} fois`);
          });
          
          // Chercher spécifiquement "Moyen"
          const moyenQuery = `
            SELECT COUNT(*) as count
            FROM "${table}"
            WHERE "${col.column_name}"::text ILIKE '%moyen%'
          `;
          
          const moyenResult = await client.query(moyenQuery);
          const moyenCount = parseInt(moyenResult.rows[0].count);
          
          if (moyenCount > 0) {
            console.log(`   ⚠️  TROUVÉ ${moyenCount} valeurs "Moyen" dans ${col.column_name}`);
            
            // Afficher les détails
            const detailsQuery = `
              SELECT *
              FROM "${table}"
              WHERE "${col.column_name}"::text ILIKE '%moyen%'
              LIMIT 3
            `;
            
            const detailsResult = await client.query(detailsQuery);
            console.log(`   Exemples:`);
            detailsResult.rows.forEach((row, index) => {
              console.log(`     ${index + 1}. ID: ${row.id}, ${col.column_name}: "${row[col.column_name]}"`);
            });
            
            // Corriger
            console.log(`   🔧 Correction des valeurs "Moyen" vers "Intermédiaire"...`);
            const updateQuery = `
              UPDATE "${table}"
              SET "${col.column_name}" = 'Intermédiaire'
              WHERE "${col.column_name}"::text ILIKE '%moyen%'
            `;
            
            const updateResult = await client.query(updateQuery);
            console.log(`   ✅ ${updateResult.rowCount} valeurs corrigées`);
          } else {
            console.log(`   ✅ Aucune valeur "Moyen" trouvée dans ${col.column_name}`);
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

checkAllRecipeTables(); 