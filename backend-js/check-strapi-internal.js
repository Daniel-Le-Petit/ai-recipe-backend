const { Pool } = require('pg');

const pool = new Pool({
  host: 'dpg-d13af43uibrs7380cfl0-a.frankfurt-postgres.render.com',
  port: 5432,
  database: 'aifb_a2h0',
  user: 'aifb',
  password: 'YD73qk3D1tRwEwNGcn6L3hXyEHxex00a',
  ssl: true
});

async function checkStrapiInternal() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Vérification des tables internes Strapi...');
    
    // Tables Strapi à vérifier
    const strapiTables = [
      'strapi_migrations_internal',
      'strapi_database_schema',
      'strapi_history_versions',
      'strapi_core_store_settings'
    ];
    
    for (const table of strapiTables) {
      console.log(`\n🔍 Vérification de la table: ${table}`);
      
      try {
        // Vérifier si la table existe
        const existsQuery = `
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          )
        `;
        
        const existsResult = await client.query(existsQuery, [table]);
        
        if (!existsResult.rows[0].exists) {
          console.log(`   ❌ Table ${table} n'existe pas`);
          continue;
        }
        
        // Compter les lignes
        const countQuery = `SELECT COUNT(*) as count FROM "${table}"`;
        const countResult = await client.query(countQuery);
        const rowCount = parseInt(countResult.rows[0].count);
        console.log(`   Nombre de lignes: ${rowCount}`);
        
        if (rowCount > 0) {
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
          
          // Chercher des valeurs "Moyen" dans toutes les colonnes textuelles
          for (const col of structureResult.rows) {
            if (['character varying', 'text', 'varchar', 'jsonb', 'json'].includes(col.data_type)) {
              try {
                const moyenQuery = `
                  SELECT COUNT(*) as count
                  FROM "${table}"
                  WHERE "${col.column_name}"::text ILIKE '%moyen%'
                `;
                
                const moyenResult = await client.query(moyenQuery);
                const moyenCount = parseInt(moyenResult.rows[0].count);
                
                if (moyenCount > 0) {
                  console.log(`   ⚠️  TROUVÉ ${moyenCount} valeurs "Moyen" dans ${col.column_name}`);
                  
                  // Afficher quelques exemples
                  const examplesQuery = `
                    SELECT "${col.column_name}"
                    FROM "${table}"
                    WHERE "${col.column_name}"::text ILIKE '%moyen%'
                    LIMIT 3
                  `;
                  
                  const examplesResult = await client.query(examplesQuery);
                  console.log(`   Exemples:`);
                  examplesResult.rows.forEach((row, index) => {
                    const value = row[col.column_name];
                    console.log(`     ${index + 1}. ${col.column_name}: "${value}"`);
                  });
                  
                  // Si c'est une colonne JSON, essayer de corriger
                  if (col.data_type === 'jsonb' || col.data_type === 'json') {
                    console.log(`   🔧 Tentative de correction dans le JSON...`);
                    
                    // Pour les colonnes JSON, on doit être plus prudent
                    const updateQuery = `
                      UPDATE "${table}"
                      SET "${col.column_name}" = REPLACE("${col.column_name}"::text, '"Moyen"', '"Intermédiaire"')::jsonb
                      WHERE "${col.column_name}"::text ILIKE '%moyen%'
                    `;
                    
                    try {
                      const updateResult = await client.query(updateQuery);
                      console.log(`   ✅ ${updateResult.rowCount} valeurs JSON corrigées`);
                    } catch (jsonError) {
                      console.log(`   ❌ Erreur lors de la correction JSON:`, jsonError.message);
                    }
                  } else {
                    // Pour les colonnes texte normales
                    console.log(`   🔧 Correction des valeurs "Moyen" vers "Intermédiaire"...`);
                    const updateQuery = `
                      UPDATE "${table}"
                      SET "${col.column_name}" = 'Intermédiaire'
                      WHERE "${col.column_name}"::text ILIKE '%moyen%'
                    `;
                    
                    const updateResult = await client.query(updateQuery);
                    console.log(`   ✅ ${updateResult.rowCount} valeurs corrigées`);
                  }
                }
              } catch (error) {
                console.log(`   ❌ Erreur lors de la vérification de ${col.column_name}:`, error.message);
              }
            }
          }
        }
        
      } catch (error) {
        console.log(`   ❌ Erreur avec la table ${table}:`, error.message);
      }
    }
    
    console.log('\n✅ Vérification des tables internes terminée!');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkStrapiInternal(); 