// 1. Load environment variables from .env file
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Property = require("./models/Property");
const TenantAssignment = require("./models/tenantAssignment");
const Payment = require("./models/Payment");

const seedDatabase = async () => {
  try {
    // 2. Connect to MongoDB
    console.log("🔌 Connecting to MongoDB...");
    const connStr = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!connStr) {
      throw new Error("MONGO_URI is missing from your .env file!");
    }

    await mongoose.connect(connStr);
    console.log("✅ MongoDB Connected successfully.");

    // 3. Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    await TenantAssignment.deleteMany({});
    await Payment.deleteMany({});
    console.log("🧹 Database cleared successfully.");

    // 4. Hash a standard default password for demo accounts
    const hashedPassword = await bcrypt.hash("password123", 10);

    // 5. Seed Users
    const users = await User.insertMany([
      {
        name: "John Doe (Tenant)",
        email: "tenant@example.com",
        phone: "+254712345678",
        password: hashedPassword,
        role: "tenant",
      },
      {
        name: "Agent Smith",
        email: "agent@example.com",
        phone: "+254787654321",
        password: hashedPassword,
        role: "agent",
      },
      {
        name: "System Admin",
        email: "admin@example.com",
        phone: "+254700000000",
        password: hashedPassword,
        role: "admin",
      },
    ]);
    console.log("👤 Users seeded successfully.");

    const tenantUser = users[0];
    const agentUser = users[1];

    // 6. Seed Properties
    const properties = await Property.insertMany([
      {
        title: "Apartment 4B - Sunset Heights",
        houseType: "2 Bedroom",
        estate: "Kilimani",
        county: "Nairobi",
        price: 45000,
        status: "occupied",
      },
    ]);
    console.log("🏢 Properties seeded successfully.");

    const activeProperty = properties[0];

    // 7. Seed Tenant Assignment (Lease Contract)
    const assignments = await TenantAssignment.insertMany([
      {
        property: activeProperty._id,
        tenant: tenantUser._id,
        assignedBy: agentUser._id,
        agreedRent: 45000,
        securityDepositPaid: 45000,
        rentArrears: 0,
        rentPaid: 45000,
        status: "active",
        startDate: new Date(),
      },
    ]);
    console.log("📄 Tenant Assignments seeded successfully.");

    const activeAssignment = assignments[0];

    // 8. Seed Payments
    await Payment.insertMany([
      {
        tenant: tenantUser._id,
        property: activeProperty._id,
        assignment: activeAssignment._id,
        amount: 45000,
        paymentType: "rent",
        paymentMethod: "mpesa",
        transactionId: "MPESA-TXN-100001",
      },
    ]);
    console.log("💳 Payments seeded successfully.");

    console.log("✅ Database Seeding Complete!");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();