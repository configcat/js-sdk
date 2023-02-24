module.exports = function(config) {
  config.set({
    frameworks: ["mocha", "chai", "webpack"],

    files: [
      "test/index.ts"
    ],

    preprocessors: {
      "test/index.ts": ["webpack", "sourcemap"],
    },

    mime: {
      "text/x-typescript": ["ts", "tsx"],
    },

    webpack: new require("./webpack.config.karma").constructor({ enableCoverage: true }),
    webpackMiddleware: {
      noInfo: true
    },

    coverageReporter: {
      // specify a common output directory
      dir: "coverage",
      reporters: [
        { type: "text-summary" },
        { type: "lcov", subdir: "report-lcov" },
        { type: "lcovonly", subdir: ".", file: "report-lcovonly.txt" },
      ]
    },

    reporters: ["progress", "coverage"],

    browsers: ["ChromeHeadless"],

    singleRun: true
  });
};
