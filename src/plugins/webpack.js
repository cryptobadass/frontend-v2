// const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const { version } = require('../../package.json');
// const AutoImport = require('unplugin-auto-import/webpack');
// const Components = require('unplugin-vue-components/webpack');
// const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');

const plugins = [
  // error: same name component like MyPoolBalancesCard
  // AutoImport({
  //   resolvers: [ElementPlusResolver()]
  // }),
  // Components({
  //   resolvers: [ElementPlusResolver()]
  // })
];

// if (process.env.VUE_APP_SENTRY_AUTH_TOKEN) {
//   const release = `frontend-v2@${version}`;
//   const ENV = process.env.VUE_APP_ENV || 'development';

//   const sentryWebpack = new SentryWebpackPlugin({
//     // sentry-cli configuration
//     authToken: process.env.VUE_APP_SENTRY_AUTH_TOKEN,
//     org: 'balancer-labs',
//     project: 'app',
//     release: release,
//     // webpack specific configuration
//     include: './dist',
//     ignore: ['node_modules', 'webpack.config.js']
//   });

//   if (['production', 'staging'].includes(ENV)) {
//     plugins.push(sentryWebpack);
//   }
// }

module.exports = plugins;
