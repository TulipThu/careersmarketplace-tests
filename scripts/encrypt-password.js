const crypto = require('crypto');
const { encryptPassword } = require('../lib/credentials');

const password = process.argv[2];
const secret = process.argv[3] || crypto.randomBytes(24).toString('hex');

if (!password) {
  console.error('Usage: node scripts/encrypt-password.js "your-password" [optional-secret]');
  process.exit(1);
}

const encrypted = encryptPassword(password, secret);

console.log('Add these lines to your .env file:\n');
console.log(`LOGIN_PASSWORD_ENCRYPTED=${encrypted}`);
console.log(`LOGIN_SECRET=${secret}`);
console.log('\nRemove LOGIN_PASSWORD if it exists (plain text).');
console.log('Keep LOGIN_SECRET private — it is required to decrypt the password.');
