/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */

const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
});
