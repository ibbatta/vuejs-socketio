module.exports = {
  prod: {
    assetsPublicPath: '/',
    assetsSubDirectory: 'static',
    assetsNodeModules: 'node_modules',
  },
  dev: {
    assetsPublicPath: '/',
    assetsSubDirectory: 'assets',
    assetsNodeModules: 'node_modules',
    port: process.env.PORT || 9000,
  },
};
