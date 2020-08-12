module.exports = {
  mode: "production",
  entry: [
    "core-js/features/promise",
    "./src/index.ts"
  ],
  output: {
    filename: "configcat.js",
    library: "configcat"
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: "tsconfig.cjs.json"
          }}]
      }
    ]
  }
};
