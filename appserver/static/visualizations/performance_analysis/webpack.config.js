const path = require('path');

module.exports = {
  mode: 'production', // or 'development'

  entry: path.resolve(__dirname, 'src', 'visualization_source.js'),

  output: {
    path: path.resolve(__dirname),
    filename: 'visualization.js',
    // webpack 5 replaces libraryTarget -> output.library.type
    library: {
      type: 'amd'
    }
  },

  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      // Prevent webpack from parsing apexcharts' modern commonJS build:
      // Make require('apexcharts') resolve to the prebuilt UMD/min file
      'apexcharts$': path.resolve(__dirname, 'node_modules', 'apexcharts', 'dist', 'apexcharts.min.js')
    }
  },

  // Treat Splunk-provided APIs as externals (AMD)
  externals: {
    'api/SplunkVisualizationBase': { amd: 'api/SplunkVisualizationBase' },
    'api/SplunkVisualizationUtils': { amd: 'api/SplunkVisualizationUtils' },
    'splunkjs/mvc': { amd: 'splunkjs/mvc' },
    'splunkjs/mvc/utils': {amd:'splunkjs/mvc/utils'}
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'), // transpile your code only
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        }
      }
    ]
  },

  // Optional: dev server config (only if you installed webpack-dev-server)
  devServer: {
    static: { directory: path.resolve(__dirname) }, // serve root
    hot: true,
    port: 8080
  },

  // Optional performance/target tweaks:
  target: ['web', 'es5'] // only if you must support IE11; otherwise omit
};