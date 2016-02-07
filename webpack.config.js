var webpackMerge = require('webpack-merge');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

var common = {
  resolve: {
    extensions: ['', '.ts', '.json', '.js', '.html']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        query: {
          'ignoreDiagnostics': [
            2403, // 2403 -> Subsequent variable declarations
            2420, // 2420 -> Class incorrectly implements interface
            2300, // 2300 -> Duplicate identifier
            2374, // 2374 -> Duplicate number index signature
            2375  // 2375 -> Duplicate string index signature
          ]
        }
      }
    ]
  }
};

var client = {
  target: 'web',
  entry: './src/client/client',
  output: {
    path: __dirname + '/dist/client'
  },
  plugins : [
    new CopyWebpackPlugin([
      { from: path.join(__dirname, 'src/client/') },
      { from: 'node_modules/es6-shim/', to: 'node_modules/es6-shim/' },
      { from: 'node_modules/es6-promise/', to: 'node_modules/es6-promise/' },
      { from: 'node_modules/reflect-metadata/', to: 'node_modules/reflect-metadata/' },
      { from: 'node_modules/zone.js/', to: 'node_modules/zone.js/' }
    ], {
      ignore: ['*.ts']
    })
  ]
};

var server = {
  target: 'node',
  entry: './src/server/server',
  plugins : [
    new CopyWebpackPlugin([
      { from: path.join(__dirname, 'src/server/') }
    ], {
      ignore: ['*.ts']
    })
  ],
  output: {
    path: __dirname + '/dist/server'
  },
  externals: function checkNodeImport(context, request, cb) {
    if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
      cb(null, 'commonjs ' + request); return;
    }
    cb();
  },
  node: {
    global: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: true
  },
  exclude: [ /node_modules/ ]
};

var defaults = {
  context: process.cwd(),
  resolve: {
    root: __dirname + '/src'
  },
  output: {
    publicPath: path.resolve(__dirname),
    filename: 'bundle.js'
  }
};

module.exports = [
  // Client
  webpackMerge({}, defaults, common, client),

  // Server
  webpackMerge({}, defaults, common, server)
];
