import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'url';
import path from 'path';

console.log("Running all node examples")

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Run all scripts in the node directory found in the parent directory
const scriptsDir = path.join(__dirname, '..', 'node');

function runScript(script) {
  return new Promise((resolve, reject) => {
    console.log(`Running script: ${script}`);
    const process = spawn('node', [script], { stdio: 'inherit' });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script ${script} exited with code ${code}`));
      }
    });
  });
}

async function runScriptsSequentially() {
  const files = fs.readdirSync(scriptsDir).filter(file => file.endsWith('.js'));

  for (const file of files) {
    const scriptPath = path.join(scriptsDir, file);
    try {
      await runScript(scriptPath);
      console.log(`Successfully ran ${file}`);
    } catch (error) {
      console.error(`Error running ${file}:`, error);
      break;
    }
  }
}
runScriptsSequentially();
