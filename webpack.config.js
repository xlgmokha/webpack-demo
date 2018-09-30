const merge = require('webpack-merge');
const path = require('path');
const glob = require('glob');
const parts = require('./webpack.parts');

const PATHS = {
  app: path.join(__dirname, "src"),
  build: path.join(__dirname, "dist"),
};

const commonConfig = merge([
  {
    output: {
      publicPath: "/",
    },
    resolveLoader: {
      alias: {
        "demo-loader": path.resolve(__dirname, "loaders/demo-loader.js"),
      },
    },
  },
  parts.loadJavaScript({ include: PATHS.app }),
  parts.setFreeVariable("HELLO", "hello from config"),
]);

const productionConfig = merge([
  {
    performance: {
      hints: "warning",
      maxEntrypointSize: 50000,
      maxAssetSize: 450000,
    }
  },
  {
    output: {
      chunkFilename: "[name].[chunkhash:4].js",
      filename: "[name].[chunkhash:4].js",
    },
  },
  parts.clean(PATHS.build),
  parts.minifyJavaScript(),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true,
      },
      safe: true,
    },
  }),
  parts.generateSourceMaps({ type: 'source-map' }),
  parts.extractCSS({
    use: ["css-loader", parts.autoprefix()]
  }),
  parts.purifyCSS({
    paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }),
  }),
  parts.loadImages({
    options: {
      limit: 15000,
      name: "[name].[hash:4].[ext]",
    },
  }),
  {
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "initial",
          }
        }
      },
      runtimeChunk: {
        name: "manifest",
      },
    }
  },
  parts.attachRevision(),
]);

const developmentConfig = merge([
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),
  parts.loadImages(),
]);

module.exports = mode => {
  process.env.BABEL_ENV = mode;
  const pages = [
    parts.page({ 
      title: "Webpack demo",
      entry: {
        app: PATHS.app,
      },
      chunks: ["app", "manifest", "vendor"],
    }),
    parts.page({ 
      title: "Another demo",
      path: "another",
      entry: {
        another: path.join(PATHS.app, "another.js"),
      },
      chunks: ["another", "manifest", "vendor"],
    }),
  ];
  const config = mode === "production" ? productionConfig : developmentConfig;
  return merge([commonConfig, config, { mode }].concat(pages));
};
