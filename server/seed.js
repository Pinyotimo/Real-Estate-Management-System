const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const connectDB = require("./config/db");
const User = require("./models/User");
const Property = require("./models/Property");
const Payment = require("./models/Payment");
const Expense = require("./models/Expense");
const Complaint = require("./models/Complaint");

const seedDatabase = async () => {
  try {
    await connectDB();

    // 1. Clear Existing Data
    await User.deleteMany();
    await Property.deleteMany();
    await Payment.deleteMany();
    await Expense.deleteMany();
    await Complaint.deleteMany();

    console.log("🧹 Database cleared.");

    // 2. Encrypt Default Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    // 3. Create Users (test accounts)
    const landlord = await User.create({
      name: "John Landlord (Prime Properties)",
      email: "landlord@test.com",
      password: hashedPassword,
      phone: "+254700111222",
      role: "agent",
    });

    const tenantResidential = await User.create({
      name: "Alice Johnson",
      email: "alice@test.com",
      password: hashedPassword,
      phone: "+254711333444",
      role: "tenant",
    });

    const tenantCommercial = await User.create({
      name: "Apex Logistics Ltd",
      email: "apex@test.com",
      password: hashedPassword,
      phone: "+254722555666",
      role: "tenant",
    });

    // 3b. Create Demo Accounts (match Login.jsx Quick Demo Login buttons)
    const demoAdmin = await User.create({
      name: "Demo Admin",
      email: "admin@demo.com",
      password: hashedPassword,
      phone: "+254700000001",
      role: "admin",
    });

    const demoAgent = await User.create({
      name: "Demo Agent",
      email: "agent@demo.com",
      password: hashedPassword,
      phone: "+254700000002",
      role: "agent",
    });

    const demoTenant = await User.create({
      name: "Demo Tenant",
      email: "tenant@demo.com",
      password: hashedPassword,
      phone: "+254700000003",
      role: "tenant",
    });

    console.log(
      "👤 Users seeded (Landlord: landlord@test.com | Demo: admin@demo.com, agent@demo.com, tenant@demo.com | Password: password123)",
    );

    // 4. Create Properties (House, Warehouse, Business Space)
    const house = await Property.create({
      title: "Modern 3BR Villa",
      description: "Spacious suburban house with garden and private parking.",
      price: 1200,
      estate: "Green Valley",
      county: "Nairobi",
      houseType: "Residential House",
      bedrooms: 3,
      bathrooms: 2,
      user: landlord._id,
      status: "occupied",
      tenantUser: tenantResidential._id,
      tenantName: tenantResidential.name,
      tenantPhone: tenantResidential.phone,
      rentPaid: 1200,
      rentArrears: 0,
      electricityMeter: "ELEC-998877",
      wifiStatus: "active",
      repairStatus: "none",
    });

    const warehouse = await Property.create({
      title: "Industrial Storage Warehouse Unit 4B",
      description:
        "5000 sqft high-ceiling warehouse with heavy-truck loading bay.",
      price: 3500,
      estate: "Industrial Area",
      county: "Nairobi",
      houseType: "Warehouse",
      user: landlord._id,
      status: "occupied",
      tenantUser: tenantCommercial._id,
      tenantName: tenantCommercial.name,
      tenantPhone: tenantCommercial.phone,
      rentPaid: 3500,
      rentArrears: 500,
      electricityMeter: "3PHASE-445511",
      wifiStatus: "active",
      repairStatus: "in_progress",
      repairNotes: "Loading dock shutter repair",
    });

    const officeSpace = await Property.create({
      title: "City Center Commercial Office Suite 12",
      description: "Prime executive business office in central district.",
      price: 2000,
      estate: "CBD",
      county: "Nairobi",
      houseType: "Business Space / Office",
      user: landlord._id,
      status: "vacant",
    });

    const retailShop = await Property.create({
      title: "Retail Shop Along Westlands Main Road",
      description:
        "High-visibility ground floor shop suitable for retail and services.",
      price: 1600,
      estate: "Westlands",
      county: "Nairobi",
      houseType: "Shop / Commercial",
      user: landlord._id,
      status: "vacant",
    });

    // 4b. Give the demo agent a listing and demo tenant an assigned unit
    const demoUnit = await Property.create({
      title: "Demo Apartment - Riverside Suites",
      description: "Sample unit created for demo login walkthroughs.",
      price: 900,
      estate: "Riverside",
      county: "Nairobi",
      houseType: "Apartment",
      bedrooms: 2,
      bathrooms: 1,
      user: demoAgent._id,
      status: "occupied",
      tenantUser: demoTenant._id,
      tenantName: demoTenant.name,
      tenantPhone: demoTenant.phone,
      rentPaid: 900,
      rentArrears: 0,
      electricityMeter: "DEMO-000001",
      wifiStatus: "active",
      repairStatus: "none",
    });

    console.log(
      "🏢 Properties seeded (1 House occupied, 1 Warehouse occupied, 1 Office vacant, 1 Shop available, 1 Demo unit occupied)",
    );

    // 5. Seed Payments
    await Payment.create([
      {
        tenant: tenantResidential._id,
        property: house._id,
        amount: 1200,
        paymentType: "rent",
        paymentMethod: "mpesa",
        transactionId: "TXN-MPESA-88391",
      },
      {
        tenant: tenantCommercial._id,
        property: warehouse._id,
        amount: 3000,
        paymentType: "rent",
        paymentMethod: "bank_transfer",
        transactionId: "TXN-BANK-00921",
      },
      {
        tenant: tenantCommercial._id,
        property: warehouse._id,
        amount: 150,
        paymentType: "electricity",
        paymentMethod: "mpesa",
        transactionId: "TXN-MPESA-11029",
      },
      {
        tenant: demoTenant._id,
        property: demoUnit._id,
        amount: 900,
        paymentType: "rent",
        paymentMethod: "mpesa",
        transactionId: "TXN-MPESA-DEMO01",
      },
    ]);

    // 6. Seed Expenses & Liabilities
    await Expense.create([
      {
        user: landlord._id,
        property: warehouse._id,
        title: "Shutter Door Roller Replacement",
        category: "repairs",
        amount: 400,
        isLiability: false,
      },
      {
        user: landlord._id,
        property: house._id,
        title: "Annual Land Rates & Property Tax",
        category: "taxes",
        amount: 650,
        isLiability: true,
      },
    ]);

    // 7. Seed Complaints / Tickets
    await Complaint.create({
      tenant: tenantCommercial._id,
      property: warehouse._id,
      title: "Water pressure low in staff washrooms",
      category: "plumbing",
      description: "Main inlet valve seems partially clogged.",
      status: "pending",
    });

    console.log("✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    process.exit();
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();