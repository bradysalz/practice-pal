module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',
      ['inline-import', { extensions: ['.sql'] }],
      'react-native-reanimated/plugin', // must be last
    ],
  };
};
