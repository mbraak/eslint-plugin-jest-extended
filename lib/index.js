"use strict";

var _fs = require("fs");
var _path = require("path");
var _package = require("../package.json");
// copied from https://github.com/babel/babel/blob/d8da63c929f2d28c401571e2a43166678c555bc4/packages/babel-helpers/src/helpers.js#L602-L606
/* istanbul ignore next */
const interopRequireDefault = obj => obj && obj.__esModule ? obj : {
  default: obj
};
const importDefault = moduleName =>
// eslint-disable-next-line @typescript-eslint/no-require-imports
interopRequireDefault(require(moduleName)).default;
const rulesDir = (0, _path.join)(__dirname, 'rules');
const excludedFiles = ['__tests__', 'utils'];
const rules = Object.fromEntries((0, _fs.readdirSync)(rulesDir).map(rule => (0, _path.parse)(rule).name).filter(rule => !excludedFiles.includes(rule)).map(rule => [rule, importDefault((0, _path.join)(rulesDir, rule))]));
const recommendedRules = {};
const allRules = Object.fromEntries(Object.entries(rules).filter(([, rule]) => !rule.meta.deprecated).map(([name]) => [`jest-extended/${name}`, 'error']));
const plugin = {
  meta: {
    name: _package.name,
    version: _package.version
  },
  // ugly cast for now to keep TypeScript happy since
  // we don't have types for flat config yet
  configs: {},
  rules
};
const createRCConfig = rules => ({
  plugins: ['jest-extended'],
  rules
});
const createFlatConfig = rules => ({
  plugins: {
    'jest-extended': plugin
  },
  rules
});
plugin.configs = {
  all: createRCConfig(allRules),
  recommended: createRCConfig(recommendedRules),
  'flat/all': createFlatConfig(allRules),
  'flat/recommended': createFlatConfig(recommendedRules)
};
module.exports = plugin;