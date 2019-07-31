const rewireStyl = require("react-app-rewire-stylus-modules");

module.exports = {
  webpack: function (config, env) {
    config = rewireStyl(config, env);

    // close devtool
    config.devtool = false;

    // change output public path
    config.output.publicPath = "./";

    return config;
  },
};