if (module.host) {
  const context = require.context("mocha-loader!./", false, /\.test.js$/);
  context.keys().forEach(context);
}
