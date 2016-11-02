import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import path from 'path';

const ENV = process.env.NODE_ENV || 'development';

const CSS_MAPS = ENV !== 'production';

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: './index.js',

  output: {
    path: path.resolve(__dirname, 'www'),
    publicPath: './',
    filename: 'bundle.js',
  },

  resolve: {
    extensions: ['', '.jsx', '.js', '.json', '.less'],
    modulesDirectories: [
      path.resolve(__dirname, 'src/lib'),
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
    ],
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      containers: path.resolve(__dirname, 'src/containers'),
      utils: path.resolve(__dirname, 'src/utils'),
      reducers: path.resolve(__dirname, 'src/reducers'),
      stores: path.resolve(__dirname, 'src/stores'),
      react: 'preact-compat',
      'react-dom': 'preact-compat',
    },
  },

  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        exclude: /src\//,
        loader: 'source-map',
      },
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /\.(less|css)$/,
        include: /src\/components\//,
        loader: ExtractTextPlugin.extract('style?singleton', [
          `css?url=false&sourceMap=${CSS_MAPS}&modules&importLoaders=1&localIdentName=[local]${process.env.CSS_MODULES_IDENT || '_[hash:base64:5]'}`,
          'postcss',
          `less?sourceMap=${CSS_MAPS}`,
        ].join('!')),
      },
      {
        test: /\.(less|css)$/,
        exclude: /src\/components\//,
        loader: ExtractTextPlugin.extract('style?singleton', [
          `css?url=false&sourceMap=${CSS_MAPS}`,
          'postcss',
          `less?sourceMap=${CSS_MAPS}`,
        ].join('!')),
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.(xml|html|txt|md)$/,
        loader: 'raw',
      },
      {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        loader: ENV === 'production' ? 'file?name=[path][name]_[hash:base64:5].[ext]' : 'url',
      },
    ],
  },

  postcss: () => [
    autoprefixer({ browsers: 'last 2 versions' }),
  ],

  plugins: ([
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('style.css', {
      allChunks: true,
      disable: ENV !== 'production',
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({ NODE_ENV: ENV }),
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: { collapseWhitespace: false },
    }),
  ]).concat(ENV === 'production' ? [
    new webpack.optimize.OccurenceOrderPlugin(),
  ] : []),

  stats: { colors: true },

  node: {
    global: true,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false,
  },

  devtool: ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map',

  devServer: {
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    colors: true,
    publicPath: '/',
    contentBase: './src',
    historyApiFallback: true,
    proxy: {
      // OPTIONAL: proxy configuration:
      // '/optional-prefix/**': { // path pattern to rewrite
      //   target: 'http://target-host.com',
      //   pathRewrite: path => path.replace(/^\/[^\/]+\//, '')   // strip first path segment
      // }
    },
  },
};
