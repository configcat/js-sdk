module.exports = function(config) {   
    config.set({
        frameworks: ["mocha", "chai", "karma-typescript"],

        files: [
            "src/**/*.ts",
            "test/**/*.ts"
        ],

        preprocessors: {
            "src/**/*.ts": ["karma-typescript"],
            "test/**/*.ts": ["karma-typescript"]
        },

        coverageReporter: {
            // specify a common output directory
            dir: "coverage",
            reporters: [
              { type: "lcov", subdir: "report-lcov" },
              { type: "lcovonly", subdir: ".", file: "report-lcovonly.txt" },
            ]
          },

        reporters: ["progress", "coverage"],

        browsers: ["ChromeHeadless"],

        singleRun: true,
        
        karmaTypescriptConfig: {
            tsconfig: "./tsconfig.karma.json",            
            bundlerOptions: {
                transforms: [
                    require("karma-typescript-es6-transform")()
                ]
            }
        }        
    });
};