const rewireStyl = require("react-app-rewire-stylus-modules");
const rewireCssModules = require('react-app-rewire-css-modules');


module.exports = {
  webpack: function (config, env) {
    config = rewireStyl(config, env);
    config = rewireCssModules(config, env);

    // close devtool
    config.devtool = false;

    // change output public path
    config.output.publicPath = "./";

    return config;
  },
};