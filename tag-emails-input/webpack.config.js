const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    index: path.resolve(__dirname, "lib/index.ts"),
    "index.min": path.resolve(__dirname, "lib/index.ts"),
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "umd",
    library: "Tagify",
  },
  target: ["web", "es5"],
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)(\?.*)?$/,
        exclude: [/node_modules/],
        use: "babel-loader",
      },
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        use: "ts-loader",
      },
      {
        test: /\.css$/,
        use: ["css-loader"],
      },
    ].filter(Boolean),
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\.min\.js$/,
      }),
    ],
  },
};
