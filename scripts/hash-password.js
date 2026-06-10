// Generate a bcrypt hash for your admin password.
// Usage:  node scripts/hash-password.js "yourPassword"
const bcrypt = require("bcryptjs");

const pw = process.argv[2];
if (!pw) {
  console.error('Usage: node scripts/hash-password.js "yourPassword"');
  process.exit(1);
}

const hash = bcrypt.hashSync(pw, 10);
// Escape every $ with a backslash so Next.js doesn't expand the $2a / $10 / $...
// segments as variable references when loading .env.local.
const escaped = hash.replace(/\$/g, "\\$");
console.log("\nAdd this to your .env.local:\n");
console.log(`ADMIN_PASSWORD_HASH=${escaped}\n`);
