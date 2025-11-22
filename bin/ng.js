#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const args = process.argv.slice(2);

if (args[0] !== 'serve') {
  console.error('Usage: ng serve');
  process.exit(1);
}

const server = spawn('python', ['-m', 'http.server', '4173'], {
  cwd: projectRoot,
  stdio: 'inherit',
});

server.on('exit', (code) => process.exit(code ?? 0));
