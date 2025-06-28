import { RecipeStateBadge } from "./extensions/content-manager/components/StatusBadge.jsx";

export default {
  config: {
    contentManager: {
      components: {
        listView: {
          fields: {
            recipeState: {
              cellComponent: RecipeStateBadge,
            },
          },
        },
      },
    },
  },
};
