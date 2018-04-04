module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "rules": {
    "indent": ["off", 2],
    "linebreak-style": [ "error","unix"],
    "quotes": ["off", "single"],
    "semi": ["error", "always"],
    "valid-jsdoc": ["error", {
      requireParamDescription: false,
      requireReturnDescription: false,
    }],
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
  }
};
