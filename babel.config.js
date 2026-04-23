module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['babel-plugin-react-compiler'],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-transform-export-namespace-from'],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
        alias: {
          '@API': './src/API',
          '@assets': './src/assets',
          '@components': './src/components',
          '@extra': './src/extra',
          '@hooks': './src/hooks',
          '@localization': './src/localization',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@stores': './src/stores',
          '@keychain': './src/keychain',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        allowUndefined: true,
        safe: false,
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
