const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path to Git hooks
const hooksDir = path.resolve(__dirname, '../.git/hooks');
const projectHooksDir = path.resolve(__dirname, 'git-hooks');

// Create hooks directory if it doesn't exist
if (!fs.existsSync(projectHooksDir)) {
  fs.mkdirSync(projectHooksDir, { recursive: true });
}

// Create pre-commit hook script
const preCommitHookPath = path.join(projectHooksDir, 'pre-commit');
fs.writeFileSync(
  preCommitHookPath,
  `#!/bin/sh
# Run Expo lint on staged files
echo "Running Expo lint..."
npm run lint

# Exit with non-zero status if Expo lint found errors
if [ $? -ne 0 ]; then
  echo "Expo lint found errors. Please fix them before committing."
  exit 1
fi

# Run TypeScript type-checking
echo "Running TypeScript..."
npx tsc --noEmit

# Exit with non-zero status if TypeScript found errors
if [ $? -ne 0 ]; then
  echo "TypeScript found errors. Please fix them before committing."
  exit 1
fi

exit 0
`,
  { mode: 0o755 }
);

// Create pre-push hook script
const prePushHookPath = path.join(projectHooksDir, 'pre-push');
fs.writeFileSync(
  prePushHookPath,
  `#!/bin/sh
# Run tests before pushing
echo "Running tests..."
npm test -- --watchAll=false

# Exit with non-zero status if tests failed
if [ $? -ne 0 ]; then
  echo "Tests failed. Please fix them before pushing."
  exit 1
fi

exit 0
`,
  { mode: 0o755 }
);

// Ensure hooks are executable
execSync(`chmod +x ${preCommitHookPath}`);
execSync(`chmod +x ${prePushHookPath}`);

// Create symbolic links for hooks
try {
  if (fs.existsSync(hooksDir)) {
    // Create symbolic links for each hook
    fs.readdirSync(projectHooksDir).forEach(hookFile => {
      const hookPath = path.join(hooksDir, hookFile);
      const projectHookPath = path.join(projectHooksDir, hookFile);

      // Remove existing hook if it exists
      if (fs.existsSync(hookPath)) {
        fs.unlinkSync(hookPath);
      }

      // Create symbolic link
      fs.symlinkSync(projectHookPath, hookPath);
      console.log(`Created symbolic link for ${hookFile}`);
    });
  } else {
    console.error('Git hooks directory not found. Is this a Git repository?');
  }
} catch (error) {
  console.error('Error setting up Git hooks:', error.message);
}

console.log('Git hooks installed successfully!');
