const { Pool } = require('pg');

const pool = new Pool({
  host: 'dpg-d13af43uibrs7380cfl0-a.frankfurt-postgres.render.com',
  port: 5432,
  database: 'aifb_a2h0',
  user: 'aifb',
  password: 'YD73qk3D1tRwEwNGcn6L3hXyEHxex00a',
  ssl: true
});

async function checkSchemaJson() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Vérification du schéma JSON de Strapi...');
    
    // Récupérer le schéma JSON
    const schemaQuery = `
      SELECT id, schema, time, hash
      FROM strapi_database_schema
      ORDER BY time DESC
      LIMIT 1
    `;
    
    const schemaResult = await client.query(schemaQuery);
    
    if (schemaResult.rows.length > 0) {
      const schemaData = schemaResult.rows[0];
      console.log(`📋 Schéma trouvé - ID: ${schemaData.id}, Time: ${schemaData.time}, Hash: ${schemaData.hash}`);
      
      const schema = schemaData.schema;
      console.log('\n🔍 Analyse du schéma JSON...');
      
      // Chercher "Moyen" dans le schéma JSON
      const schemaString = JSON.stringify(schema);
      
      if (schemaString.includes('Moyen')) {
        console.log('⚠️  TROUVÉ "Moyen" dans le schéma JSON!');
        
        // Afficher les parties du schéma qui contiennent "Moyen"
        const lines = schemaString.split('\n');
        lines.forEach((line, index) => {
          if (line.includes('Moyen')) {
            console.log(`   Ligne ${index + 1}: ${line.trim()}`);
          }
        });
        
        // Corriger le schéma JSON
        console.log('\n🔧 Correction du schéma JSON...');
        const correctedSchemaString = schemaString.replace(/"Moyen"/g, '"Intermédiaire"');
        const correctedSchema = JSON.parse(correctedSchemaString);
        
        // Mettre à jour le schéma
        const updateQuery = `
          UPDATE strapi_database_schema
          SET schema = $1
          WHERE id = $2
        `;
        
        const updateResult = await client.query(updateQuery, [correctedSchema, schemaData.id]);
        console.log(`✅ Schéma JSON corrigé (${updateResult.rowCount} ligne mise à jour)`);
        
        // Vérifier après correction
        const afterQuery = `
          SELECT schema
          FROM strapi_database_schema
          WHERE id = $1
        `;
        
        const afterResult = await client.query(afterQuery, [schemaData.id]);
        const afterSchema = afterResult.rows[0].schema;
        const afterSchemaString = JSON.stringify(afterSchema);
        
        if (afterSchemaString.includes('Moyen')) {
          console.log('❌ Il reste encore "Moyen" dans le schéma');
        } else {
          console.log('✅ Plus de "Moyen" dans le schéma JSON');
        }
        
      } else {
        console.log('✅ Aucune référence à "Moyen" trouvée dans le schéma JSON');
        
        // Afficher quand même la structure du schéma pour debug
        console.log('\n📋 Structure du schéma:');
        if (schema.collectionTypes) {
          console.log('Collection Types:', Object.keys(schema.collectionTypes));
          
          // Vérifier spécifiquement recipie
          if (schema.collectionTypes['api::recipie.recipie']) {
            const recipieSchema = schema.collectionTypes['api::recipie.recipie'];
            console.log('\nRecipie Schema:');
            if (recipieSchema.attributes && recipieSchema.attributes.difficulty) {
              console.log('Difficulty enum:', recipieSchema.attributes.difficulty.enum);
            }
          }
        }
      }
      
    } else {
      console.log('❌ Aucun schéma trouvé dans strapi_database_schema');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkSchemaJson(); 