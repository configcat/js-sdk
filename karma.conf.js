module.exports = function(config) {
    config.set({

        frameworks: ["mocha", "chai", "karma-typescript"],

        files: [
            'src/**/*.ts',
            'test/**/*.ts'
        ],

        preprocessors: {
            "**/*.ts": ["karma-typescript"]
        },

        reporters: ["progress"],

        browsers: ["ChromeHeadless"],

        singleRun: true
    });
};