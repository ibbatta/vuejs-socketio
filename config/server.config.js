module.exports = {
  prod: {
    assetsPublicPath: '/',
    assetsNodeModules: '/node_modules',
    assetsFavicon: '/favicons',
    outputPath: '/dist',
  },
  dev: {
    assetsPublicPath: '/',
    assetsNodeModules: '/node_modules',
    assetsFavicon: '/favicons',
    outputPath: '/dist',
  },
  monitor: {
    target: './.monitor/stats.json',
    port: process.env.MONITOR_PORT || 9001,
  },
};
