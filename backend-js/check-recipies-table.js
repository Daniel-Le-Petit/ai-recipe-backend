const { Pool } = require('pg');

const pool = new Pool({
  host: 'dpg-d13af43uibrs7380cfl0-a.frankfurt-postgres.render.com',
  port: 5432,
  database: 'aifb_a2h0',
  user: 'aifb',
  password: 'YD73qk3D1tRwEwNGcn6L3hXyEHxex00a',
  ssl: true
});

async function checkRecipiesTable() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Vérification spécifique de la table recipies...');
    
    // 1. Vérifier la structure de la table
    const structureQuery = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'recipies' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `;
    
    const structureResult = await client.query(structureQuery);
    console.log('\n📋 Structure de la table recipies:');
    structureResult.rows.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // 2. Vérifier toutes les valeurs de difficulty
    const difficultyQuery = `
      SELECT id, document_id, title, difficulty, duration
      FROM recipies 
      ORDER BY id
    `;
    
    const difficultyResult = await client.query(difficultyQuery);
    console.log(`\n📊 Total des recettes: ${difficultyResult.rows.length}`);
    
    if (difficultyResult.rows.length > 0) {
      console.log('\n🔍 Valeurs de difficulty trouvées:');
      const difficulties = {};
      difficultyResult.rows.forEach(row => {
        const diff = row.difficulty || 'NULL';
        difficulties[diff] = (difficulties[diff] || 0) + 1;
        console.log(`   ID ${row.id}: "${row.title}" - difficulty: "${diff}" - duration: "${row.duration}"`);
      });
      
      console.log('\n📈 Résumé des difficultés:');
      Object.entries(difficulties).forEach(([diff, count]) => {
        console.log(`   "${diff}": ${count} recettes`);
      });
      
      // 3. Chercher spécifiquement "Moyen"
      const moyenQuery = `
        SELECT id, document_id, title, difficulty, duration
        FROM recipies 
        WHERE difficulty ILIKE '%moyen%'
      `;
      
      const moyenResult = await client.query(moyenQuery);
      
      if (moyenResult.rows.length > 0) {
        console.log(`\n⚠️  TROUVÉ ${moyenResult.rows.length} recettes avec "Moyen":`);
        moyenResult.rows.forEach(row => {
          console.log(`   ID ${row.id}: "${row.title}" - difficulty: "${row.difficulty}"`);
        });
        
        // 4. Corriger les valeurs "Moyen"
        console.log('\n🔧 Correction des valeurs "Moyen" vers "Intermédiaire"...');
        const updateQuery = `
          UPDATE recipies 
          SET difficulty = 'Intermédiaire' 
          WHERE difficulty ILIKE '%moyen%'
        `;
        
        const updateResult = await client.query(updateQuery);
        console.log(`✅ ${updateResult.rowCount} valeurs corrigées`);
        
        // 5. Vérifier après correction
        const afterQuery = `
          SELECT id, document_id, title, difficulty
          FROM recipies 
          WHERE difficulty ILIKE '%moyen%'
        `;
        
        const afterResult = await client.query(afterQuery);
        if (afterResult.rows.length === 0) {
          console.log('✅ Aucune valeur "Moyen" restante');
        } else {
          console.log(`❌ Il reste encore ${afterResult.rows.length} valeurs "Moyen"`);
        }
        
      } else {
        console.log('\n✅ Aucune valeur "Moyen" trouvée dans la table recipies');
      }
    } else {
      console.log('\n📭 La table recipies est vide');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkRecipiesTable(); 