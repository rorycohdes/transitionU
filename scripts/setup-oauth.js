/**
 * Setup Google OAuth for development
 *
 * This script:
 * 1. Creates a .env file from .env.example if it doesn't exist
 * 2. Guides the user on configuring Google OAuth
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

// Base paths
const rootDir = path.resolve(__dirname, '..');
const envExamplePath = path.join(rootDir, '.env.example');
const envPath = path.join(rootDir, '.env');

// Check if .env exists
const setupEnvFile = () => {
  console.log(`${colors.cyan}Checking for .env file...${colors.reset}`);

  if (!fs.existsSync(envExamplePath)) {
    console.error(`${colors.red}Error: .env.example not found!${colors.reset}`);
    return false;
  }

  if (fs.existsSync(envPath)) {
    console.log(`${colors.green}.env file already exists.${colors.reset}`);
    return true;
  }

  // Copy .env.example to .env
  fs.copyFileSync(envExamplePath, envPath);
  console.log(`${colors.green}Created .env file from .env.example${colors.reset}`);
  return true;
};

// Guide for Google OAuth setup
const showOAuthInstructions = () => {
  console.log(`
${colors.bright}${colors.magenta}===== Google OAuth Setup Guide =====${colors.reset}

${colors.yellow}Step 1:${colors.reset} Go to the ${colors.blue}Google Cloud Console${colors.reset}
         https://console.cloud.google.com/

${colors.yellow}Step 2:${colors.reset} Create a project or select an existing one

${colors.yellow}Step 3:${colors.reset} Navigate to "APIs & Services" > "Credentials"

${colors.yellow}Step 4:${colors.reset} Click "Create Credentials" and select "OAuth client ID"

${colors.yellow}Step 5:${colors.reset} Set up credentials for each platform:

   ${colors.cyan}For Web:${colors.reset}
   - Select "Web application"
   - Set a name (e.g., "TransitionU Web")
   - Add authorized JavaScript origins:
     * https://localhost:8082
     * https://auth.expo.io
   - Add authorized redirect URIs:
     * https://auth.expo.io/@your-expo-username/TransitionU
     (Replace 'your-expo-username' with your Expo username)

   ${colors.cyan}For iOS:${colors.reset}
   - Select "iOS" as the application type
   - Set a name (e.g., "TransitionU iOS")
   - Enter your app's bundle ID (from app.json: com.transitionu.app)

   ${colors.cyan}For Android:${colors.reset}
   - Select "Android" as the application type
   - Set a name (e.g., "TransitionU Android")
   - Enter your app's package name (from app.json: com.transitionu.app)
   - For development, you'll need a SHA-1 certificate fingerprint

${colors.yellow}Step 6:${colors.reset} After creating the credentials, copy the client IDs 
         and update your .env file
  `);
};

// Prompt user to update .env
const promptForEnvUpdate = () => {
  console.log(
    `${colors.yellow}Please update your .env file with the following values:${colors.reset}`
  );
  console.log(`
${colors.cyan}EXPO_USERNAME=${colors.reset}your_expo_username
${colors.cyan}EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=${colors.reset}your_web_client_id
${colors.cyan}EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=${colors.reset}your_ios_client_id
${colors.cyan}EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=${colors.reset}your_android_client_id
  `);

  rl.question(
    `${colors.green}Would you like to open the .env file now? (y/n) ${colors.reset}`,
    answer => {
      if (answer.toLowerCase() === 'y') {
        try {
          // Try to open the file with the default editor
          if (process.platform === 'win32') {
            execSync(`notepad "${envPath}"`);
          } else if (process.platform === 'darwin') {
            execSync(`open "${envPath}"`);
          } else {
            // Linux and other platforms
            execSync(`xdg-open "${envPath}"`);
          }
        } catch (error) {
          console.error(
            `${colors.red}Could not open .env file automatically. Please open it manually.${colors.reset}`
          );
        }
      }

      console.log(`
${colors.bright}${colors.green}Next Steps:${colors.reset}
1. Install the required dependencies:
   ${colors.yellow}npm install${colors.reset}

2. Start the application with the alternative port:
   ${colors.yellow}npm run start:alt${colors.reset}
    `);

      rl.close();
    }
  );
};

// Main function
const main = () => {
  console.log(
    `\n${colors.bright}${colors.green}===== TransitionU OAuth Setup =====\n${colors.reset}`
  );

  if (setupEnvFile()) {
    showOAuthInstructions();
    promptForEnvUpdate();
  } else {
    console.log(`${colors.red}Setup failed. Please check the errors above.${colors.reset}`);
    rl.close();
  }
};

// Run the script
main();
