// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Change the server port to 8082
config.server = {
  ...config.server,
  port: 8082,
};

module.exports = config;
