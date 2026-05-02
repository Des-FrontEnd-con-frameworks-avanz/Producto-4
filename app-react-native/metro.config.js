const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Esto impide que Metro escanee carpetas de compilación para evitar errores.
    blockList: [
      /android\/.*/,
      /ios\/.*/,
      /node_modules\/.*\/android\/.*/
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);