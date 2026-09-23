require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// 1. Explicitly import models to register schemas with Mongoose on boot
require("./models/User");
require("./models/Property");
require("./models/tenantAssignment"); // Ensure casing matches your actual filename
require("./models/Payment");
require("./models/Complaint");

// 2. Import Routes
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const agentRoutes = require("./routes/agentRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const tenantAssignmentRoutes = require("./routes/assignmentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// 3. Import Custom Error Middleware
const errorMiddleware = require("./middleware/errorMiddleware");

// Connect to MongoDB
connectDB();

// Initialize Express App
const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root Health Check Route
app.get("/", (req, res) => {
  res.send("Real Estate API is running");
});

// API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/tenant", tenantRoutes);
app.use("/api/assignments", tenantAssignmentRoutes); // Fixed variable reference
app.use("/api/notifications", notificationRoutes);

// Error Handling Middleware (must be after routes)
app.use(errorMiddleware);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
});