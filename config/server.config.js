module.exports = {
  prod: {
    assetsPublicPath: '/',
    assetsNodeModules: 'node_modules',
  },
  dev: {
    assetsPublicPath: '/',
    assetsNodeModules: 'node_modules',
    port: process.env.PORT || 9000,
  },
  monitor: {
    target: './.monitor/stats.json',
    port: process.env.MONITOR_PORT || 9001,
  },
};
