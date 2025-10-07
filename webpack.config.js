const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const packageJson = require("./package.json");

module.exports = (webpackConfigEnv, argv) => {
  const orgName = "syscolabs";
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: "root-config",
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  });

  return merge(defaultConfig, {
    output: {
      publicPath: "http://localhost:9001/",
      clean: true
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'root',
        library: { type: 'var', name: 'root' },
        filename: 'remoteEntry.js',
        exposes: {
          './eventBus': './src/utils/eventBus.ts'
        },
        shared: {
          react: { 
            singleton: true,
            requiredVersion: '18.2.0',
            eager: true
          },
          'react-dom': { 
            singleton: true,
            requiredVersion: '18.2.0',
            eager: true
          },
          'single-spa-react': { 
            singleton: true,
            requiredVersion: '^6.0.2',
            eager: true
          },
          '@reduxjs/toolkit': {
            singleton: true,
            eager: true,
            requiredVersion: '^2.9.0'
          },
          'react-redux': {
            singleton: true,
            eager: true,
            requiredVersion: '^9.2.0'
          },
          '@reduxjs/toolkit/query/react': {
            singleton: true,
            eager: true
          }
        }
      }),
      new HtmlWebpackPlugin({
        inject: false,
        template: "src/index.ejs",
        templateParameters: {
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
          orgName,
        },
      }),
    ],
  });
};
