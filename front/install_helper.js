const { execSync } = require('child_process');
const fs = require('fs');

try {
  console.log('Starting npm install...');
  const output = execSync('npm install react-calendar date-fns --save', {
    encoding: 'utf8',
  });
  fs.writeFileSync('install_output.log', output);
  console.log('npm install finished successfully.');
} catch (error) {
  fs.writeFileSync(
    'install_error.log',
    error.message + '\n' + error.stdout + '\n' + error.stderr,
  );
  console.error('npm install failed.');
}
