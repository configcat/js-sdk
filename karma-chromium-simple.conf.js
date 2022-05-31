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

        reporters: ["progress"],

        browsers: ["ChromiumHeadless"],

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