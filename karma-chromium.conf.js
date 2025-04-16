module.exports = function(config) {
  config.set({
    frameworks: ["mocha", "chai", "webpack"],

    client: {
      mocha: {
        timeout: 30000
      }
    },

    files: [
      "test/index.ts"
    ],

    preprocessors: {
      "test/index.ts": ["webpack", "sourcemap"],
    },

    mime: {
      "text/x-typescript": ["ts", "tsx"],
    },

    webpack: require("./webpack.config.karma"),
    webpackMiddleware: {
      noInfo: true
    },

    reporters: ["progress"],

    browsers: ["ChromiumHeadless"],

    singleRun: true
  });
};
