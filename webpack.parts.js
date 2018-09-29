const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');

exports.extractCSS = ({ include, exclude, use = [] }) => {
  const plugin = new MiniCssExtractPlugin({
    filename: "[name].css",
  });

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,
          use: [ MiniCssExtractPlugin.loader ].concat(use),
        },
      ],
    },
    plugins: [plugin]
  };
};

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    stats: "errors-only",
    host,
    port,
    open: true,
    overlay: true,
  },
});

exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
});

exports.purifyCSS = ({ paths }) => ({
  plugins: [new PurifyCSSPlugin({ paths })],
});

exports.autoprefix = () => ({
  loader: "postcss-loader",
  options: {
    plugins: () => [require("autoprefixer")()],
  }
});

exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        include,
        exclude,
        use: {
          loader: "url-loader",
          options,
        },
      }
    ]
  },
});

exports.loadJavaScript = ({ include, exclude } = {}) => (
  {
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,
        use: "babel-loader",
      },
    ],
  },
}
);

exports.generateSourceMaps = ({ type }) => ({
  devtool: type,
});

exports.clean = path => ({
  plugins: [new CleanWebpackPlugin([path])],
});

exports.attachRevision = () => ({
  plugins: [
    new webpack.BannerPlugin({
      banner: new GitRevisionPlugin().version(),
    }),
  ]
});

exports.minifyJavaScript = () => ({
  optimization: {
    minimizer: [new UglifyWebpackPlugin({ sourceMap: true })],
  },
});
