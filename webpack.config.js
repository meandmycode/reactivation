import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import PostCSSAssetsPlugin from "postcss-assets-webpack-plugin";
import Autoprefixer from "autoprefixer";
import cssvariables from "postcss-css-variables";
import ImageminPlugin from "imagemin-webpack-plugin";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

const mode = process.env.NODE_ENV;
const isProduction = process.env.NODE_ENV === "production";
const ASSET_NAME_TEMPLATE = "[name]-[hash:6].[ext]";
const localIdentName = isProduction ? "[hash:6]" : "[path]-[local]_[hash:6]";
const context = path.resolve("src");
const buildDirectory = path.resolve("build");
const entry = ".";

const extractCss = new ExtractTextPlugin({
  filename: ASSET_NAME_TEMPLATE.replace("[ext]", "css")
});

const cssPipeline = isProduction
  ? (...use) => extractCss.extract({ use })
  : (...use) => ["style-loader", ...use];

const styleNameConfig = {
  context,
  webpackHotModuleReloading: true,
  handleMissingStyleName: "ignore",
  generateScopedName: localIdentName
};

const rules = [
  {
    // js pipeline
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: "thread-loader"
      },
      {
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          highlightCode: true,
          plugins: [["react-css-modules", styleNameConfig]]
        }
      }
    ]
  },
  {
    // css pipeline
    test: /\.css$/,
    exclude: /node_modules/,
    use: cssPipeline({
      loader: "css-loader",
      options: {
        modules: {
          localIdentName
        }
      }
    })
  },
  {
    // third party css pipeline
    test: /\.css$/,
    include: /node_modules/,
    use: cssPipeline({
      loader: "css-loader"
    })
  },
  {
    // any other assets
    exclude: /\.(js|jsx|ts|tsx|mjs|json|css|html)$/,
    use: [
      {
        loader: "file-loader",
        options: {
          name: ASSET_NAME_TEMPLATE
        }
      }
    ]
  }
];

const plugins = [
  new webpack.EnvironmentPlugin("NODE_ENV"),
  new CaseSensitivePathsPlugin(),
  new PostCSSAssetsPlugin({
    plugins: [cssvariables, Autoprefixer],
    log: false
  }),
  new HtmlWebpackPlugin({
    template: "index.html",
    minify: { collapseWhitespace: true, collapseBooleanAttributes: true },
    environment: process.env
  })
];

if (isProduction) {
  plugins.push(
    new OptimizeCssAssetsPlugin(),
    new ImageminPlugin.default(),
    extractCss
  );
}

const devtool = isProduction ? "hidden-source-map" : "cheap-module-source-map";

const optimization = {
  splitChunks: {
    chunks: "async"
  },
  minimizer: [
    new TerserPlugin({
      terserOptions: {
        ecma: 8,
        safari10: true
      }
    })
  ]
};

export default {
  mode,
  entry,
  context,
  plugins,
  optimization,
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    // TODO: supports resolving src relative until the following lands in vscode
    // https://github.com/guybedford/package-name-resolution
    modules: [context, "node_modules"]
  },
  module: {
    rules
  },
  devtool,
  output: {
    path: buildDirectory,
    filename: ASSET_NAME_TEMPLATE.replace("[ext]", "js"),
    chunkFilename: ASSET_NAME_TEMPLATE.replace("[ext]", "js").replace(
      "[hash:6]",
      "[chunkhash:6]"
    )
  }
};
