// server/utils/auditLogger.js
const AuditLog = require("../models/AuditLog");

/**
 * Logs system activity with client network and user metadata
 */
const createAuditLog = async (req, { action, module = "SYSTEM", status = "success", details = {} }) => {
  try {
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      req.ip ||
      "0.0.0.0";
      
    const userAgent = req.headers["user-agent"] || "Unknown Device";

    await AuditLog.create({
      user: req.user?._id || null,
      actorName: req.user?.name || "Guest / System",
      email: req.user?.email || "N/A",
      role: req.user?.role || "guest",
      action,
      module,
      ipAddress,
      userAgent,
      status,
      details,
    });
  } catch (error) {
    console.error("❌ Failed to create audit log:", error.message);
  }
};

module.exports = createAuditLog;