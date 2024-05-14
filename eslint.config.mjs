import globals from "globals";

import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'


export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: globals.browser }},
  {ignores: [".dist/*"]},
  eslintPluginPrettierRecommended
];

