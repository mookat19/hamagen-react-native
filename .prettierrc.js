module.exports = {
  tabWidth: 2,
  printWidth: 80,
  bracketSpacing: false,
  jsxBracketSameLine: true,
  singleQuote: true,
  bracketSpacing: true,
  trailingComma: 'es5',
  useTabs: false,
  overrides: [
    {
      files: '*.json',
      options: { parser: 'json', printWidth: 200 },
    },
  ],
};
