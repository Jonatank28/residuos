module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin', 'react-native-paper/babel', 'module:react-native-dotenv'], 
  env: {
    production: {
      plugins: ['react-native-reanimated/plugin', 'react-native-paper/babel', 'module:react-native-dotenv'], 
    },
  },
};
