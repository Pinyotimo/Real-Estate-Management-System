const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
const User = require('./models/User');

// 🌐 Force Node.js to use Google's DNS servers (fixes DNS querySrv errors)
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing demo users if present
    await User.deleteMany({
      email: { $in: ['admin@test.com', 'agent@test.com', 'tenant@demo.com'] },
    });

    // Create 3 fresh accounts
    await User.create([
      { name: 'System Admin', email: 'admin@test.com', password: 'password123', role: 'admin' },
      { name: 'Sarah Agent', email: 'agent@test.com', password: 'password123', role: 'agent' },
      { name: 'John Tenant', email: 'tenant@test.com', password: 'password123', role: 'tenant' },
    ]);

    console.log('✅ Demo users created successfully!');
    console.log('🔑 Admin: admin@test.com | password123');
    console.log('🔑 Agent: agent@test.com | password123');
    console.log('🔑 Tenant: tenant@test.com | password123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();