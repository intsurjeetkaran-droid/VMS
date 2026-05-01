/**
 * Seed Script — Creates the initial admin user
 * Run once: node src/scripts/seed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email: 'admin@vms.com' });
  if (existing) {
    console.log('Admin already exists. Skipping seed.');
    process.exit(0);
  }

  await User.create({
    name: 'Super Admin',
    email: 'admin@vms.com',
    password: 'Admin@123',
    role: 'admin',
    department: 'Management',
  });

  console.log('✅ Admin user created:');
  console.log('   Email:    admin@vms.com');
  console.log('   Password: Admin@123');
  console.log('   ⚠️  Change the password after first login!');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
