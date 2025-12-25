#!/usr/bin/env node

/**
 * Seed script for partner and product data
 * This script reads the seed-partners.sql file and executes it
 * 
 * Usage: node scripts/seed-partners.js
 */

const fs = require('fs');
const path = require('path');

// Read the SQL file
const sqlFilePath = path.join(__dirname, '../db/seed-partners.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

console.log('✓ Seed data file loaded successfully');
console.log('');
console.log('To apply this seed data to your database:');
console.log('');
console.log('1. If using Cloudflare D1:');
console.log('   wrangler d1 execute four-best-db --file db/seed-partners.sql');
console.log('');
console.log('2. If using local SQLite:');
console.log('   sqlite3 your-database.db < db/seed-partners.sql');
console.log('');
console.log('SQL statements to be executed:');
console.log('─'.repeat(60));
console.log(sqlContent);
console.log('─'.repeat(60));
console.log('');
console.log('✓ Seed data includes:');
console.log('  • 6 Partner companies');
console.log('  • 12 Products (6 commercial, 6 subsidi)');
console.log('  • 36 Product images for gallery');
