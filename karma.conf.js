const parts = require("./webpack.parts");
const path = require("path");

module.exports = config => {
  const tests = "tests/*.test.js";

  process.env.BABEL_ENV = "karma";
  config.set({
    frameworks: ["mocha"],
    files: [
      {
        pattern: tests,
      },
    ],
    preprocessors: {
      [tests]: ["webpack"],
    },
    webpack: parts.loadJavaScript(),
    singleRun: true,
    browsers: ['Chrome'],
    reporters: ["coverage"],
    coverageReporter: {
      dir: "build",
      reporters: [{ type: "html" }, { type: "lcov" }],
    },
  });
};
