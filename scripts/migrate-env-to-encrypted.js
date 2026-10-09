const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { encryptPassword } = require('../lib/credentials');

const envPath = path.join(__dirname, '..', '.env');

if (!fs.existsSync(envPath)) {
  console.error('.env file not found. Create it first from .env.example');
  process.exit(1);
}

const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
let email = '';
let plainPassword = '';
let encryptedPassword = '';
let secret = '';

for (const line of lines) {
  if (line.startsWith('LOGIN_EMAIL=')) email = line.slice('LOGIN_EMAIL='.length);
  if (line.startsWith('LOGIN_PASSWORD=')) plainPassword = line.slice('LOGIN_PASSWORD='.length);
  if (line.startsWith('LOGIN_PASSWORD_ENCRYPTED=')) encryptedPassword = line.slice('LOGIN_PASSWORD_ENCRYPTED='.length);
  if (line.startsWith('LOGIN_SECRET=')) secret = line.slice('LOGIN_SECRET='.length);
}

if (encryptedPassword && secret) {
  console.log('.env already uses encrypted credentials. No changes made.');
  process.exit(0);
}

if (!plainPassword) {
  console.error('LOGIN_PASSWORD not found in .env. Nothing to encrypt.');
  process.exit(1);
}

const loginSecret = secret || crypto.randomBytes(24).toString('hex');
const loginEncrypted = encryptPassword(plainPassword, loginSecret);

const updated = [
  `LOGIN_EMAIL=${email}`,
  `LOGIN_PASSWORD_ENCRYPTED=${loginEncrypted}`,
  `LOGIN_SECRET=${loginSecret}`,
  '',
].join('\n');

fs.writeFileSync(envPath, updated, 'utf8');

console.log('Done. .env now stores an encrypted password instead of plain text.');
console.log('Keep LOGIN_SECRET private — it is required to decrypt the password.');
