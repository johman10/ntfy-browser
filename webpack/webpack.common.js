/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */

const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");
const WextManifestWebpackPlugin = require("wext-manifest-webpack-plugin");

const TARGET_BROWSER = process.env.TARGET_BROWSER;

module.exports = {
  entry: {
    manifest: path.join(srcDir, "manifest.json"),
    "js/popup": path.join(srcDir, "popup.tsx"),
    "js/options": path.join(srcDir, "options.tsx"),
    "js/background": path.join(srcDir, "background.ts"),
  },
  output: {
    path: path.join(__dirname, `../dist/${TARGET_BROWSER}`),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        type: "javascript/auto",
        test: /manifest\.json$/,
        use: {
          loader: "wext-manifest-loader",
          options: {
            usePackageJSONVersion: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: "./", context: "public" }],
      options: {},
    }),
    new WextManifestWebpackPlugin(),
  ],
};
