import Constants from 'expo-constants';
import developmentConfig from './environments/development';
import stagingConfig from './environments/staging';
import productionConfig from './environments/production';

// Get the environment from the extra field in app.json or default to development
const getEnvironment = () => {
  const env = Constants.expoConfig?.extra?.env || 'development';
  return env;
};

// Select the appropriate config based on the environment
const getConfig = () => {
  const env = getEnvironment();

  switch (env) {
    case 'production':
      return productionConfig;
    case 'staging':
      return stagingConfig;
    case 'development':
    default:
      return developmentConfig;
  }
};

// Export the configuration for the current environment
const config = getConfig();

export default config;
