require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Import Custom Error Middleware
const errorMiddleware = require("./middleware/errorMiddleware");

// Connect to MongoDB
connectDB();

// Initialize Express App
const app = express();

const path = require("path");

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
app.use("/api/agent", require("./routes/agentRoutes"));
app.use("/api/tenant", require("./routes/tenantRoutes"));

// Error Handling Middleware (must be after routes)
app.use(errorMiddleware);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
