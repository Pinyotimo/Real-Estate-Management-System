const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

const seedUsers = async () => {
  try {
    const connStr = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!connStr) throw new Error('MONGO_URI is missing from .env!');

    console.log(`🔌 Connecting to MongoDB: ${connStr.split('@').pop() || connStr}`);
    await mongoose.connect(connStr);

    // Clean up old demo accounts
    const demoEmails = [
      'admin@test.com', 'agent@test.com', 'tenant@test.com',
      'admin@demo.com', 'agent@demo.com', 'tenant@demo.com'
    ];
    await User.deleteMany({ email: { $in: demoEmails } });

    // Hash password ONCE
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Bypass Mongoose middleware using native collection driver
    await User.collection.insertMany([
      {
        name: 'System Admin',
        email: 'admin@test.com',
        phone: '+254700000000',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sarah Agent',
        email: 'agent@test.com',
        phone: '+254787654321',
        password: hashedPassword,
        role: 'agent',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'John Tenant',
        email: 'tenant@test.com',
        phone: '+254712345678',
        password: hashedPassword,
        role: 'tenant',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log('✅ Demo users seeded successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error.message || error);
    process.exit(1);
  }
};

seedUsers();