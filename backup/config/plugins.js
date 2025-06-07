export default ({ env }) => ({
  // Exemple config pour un plugin
  upload: {
    provider: 'local',
    providerOptions: {
      sizeLimit: 1000000,
    },
  },
});
