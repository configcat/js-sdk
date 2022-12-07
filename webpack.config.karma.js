const path = require("path");

module.exports = new function (options) {
  options = options || {};

  return Object.assign(this, {
    mode: "production",
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: [".ts", ".tsx", ".js"]
    },
    devtool: "inline-source-map",
    optimization: {
      // This is a workaround necessary because source maps are broken by default in karma-webpack 5.0.0
      // (see https://github.com/ryanclark/karma-webpack/issues/493#issuecomment-780411348)
      splitChunks: false
    },
    module: {
      rules: [
        ...(options.enableCoverage
          ? [{
              test: /\.ts$/,
              include: [path.resolve('src')],
              use: {
                loader: '@ephesoft/webpack.istanbul.loader',
                options: { esModules: true },
              },
              enforce: 'post'
            }]
          : []
        ),
        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
        {
          test: /\.tsx?$/,
          use: [{
            loader: 'ts-loader',
            options: {
              configFile: "tsconfig.karma.json"
            }
          }]
        }
      ]
    }
  });
};
