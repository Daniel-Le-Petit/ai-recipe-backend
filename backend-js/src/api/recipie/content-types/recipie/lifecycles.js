module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Vérifie si une recette avec le même titre existe déjà
    const existing = await strapi.db.query('api::recipie.recipie').findOne({
      where: { title: data.title },
    });

    if (existing) {
      // Si oui, on cherche tous les titres similaires pour trouver le bon suffixe
      const similarTitles = await strapi.db.query('api::recipie.recipie').findMany({
        where: { title: { $startsWith: data.title } },
        select: ['title'],
      });

      let counter = 2;
      let newTitle = `${data.title} (${counter})`;

      // Crée un ensemble de titres existants pour une recherche rapide
      const titlesSet = new Set(similarTitles.map(r => r.title));

      // Boucle jusqu'à trouver un titre unique
      while (titlesSet.has(newTitle)) {
        counter++;
        newTitle = `${data.title} (${counter})`;
      }

      // Met à jour les données avec le nouveau titre unique
      event.params.data.title = newTitle;
    }
  },
}; 