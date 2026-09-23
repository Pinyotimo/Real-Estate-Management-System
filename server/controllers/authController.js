const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const createAuditLog = require("../utils/auditLogger");

// Helper to sign JWT safely with a fallback secret
const generateToken = (id, tokenVersion = 0) => {
  const secret = process.env.JWT_SECRET || "fallback_jwt_secret_key_12345";
  return jwt.sign({ id, tokenVersion }, secret, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user / agent
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body; // <-- Added phone here

    if (!email || !password) {
      await createAuditLog(req, {
        action: "Registration failed: Missing required fields",
        module: "AUTH",
        status: "failed",
      });
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and password" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      req.user = { email: normalizedEmail, name: name || "Guest", role: role || "guest" };
      await createAuditLog(req, {
        action: `Registration failed: Email already exists [${normalizedEmail}]`,
        module: "AUTH",
        status: "failed",
      });
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // <-- Added phone to the creation payload
    const user = await User.create({ name, email: normalizedEmail, password, role, phone });

    // Attach created user for audit logger metadata
    req.user = user;
    await createAuditLog(req, {
      action: `New user account created (${user.email}) with role [${user.role}]`,
      module: "AUTH",
      status: "success",
      details: { role: user.role, email: user.email },
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        role: user.role,
        token: generateToken(user._id, user.tokenVersion),
      },
    });
  } catch (error) {
    await createAuditLog(req, {
      action: `Registration error: ${error.message}`,
      module: "AUTH",
      status: "failed",
    });
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      await createAuditLog(req, {
        action: "Login failed: Missing email or password",
        module: "AUTH",
        status: "failed",
      });
      return res
        .status(400)
        .json({ success: false, message: "Please enter email and password" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Explicitly include +password in query
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      req.user = { email: normalizedEmail, name: "Unknown User", role: "guest" };
      await createAuditLog(req, {
        action: `Login failed: User email not found [${normalizedEmail}]`,
        module: "AUTH",
        status: "failed",
        details: { attemptedEmail: normalizedEmail },
      });
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Temporarily attach found user object so audit log knows who attempted login
    req.user = user;

    // Verify password via schema method or direct bcrypt comparison
    let isMatch = false;
    if (typeof user.matchPassword === "function") {
      isMatch = await user.matchPassword(password);
    } else if (user.password) {
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
      await createAuditLog(req, {
        action: `Login failed: Invalid password entered [${normalizedEmail}]`,
        module: "AUTH",
        status: "failed",
      });
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    if (user.suspended) {
      await createAuditLog(req, {
        action: `Login blocked: Suspended user attempt [${normalizedEmail}]`,
        module: "AUTH",
        status: "warning",
      });
      return res
        .status(403)
        .json({ success: false, message: "This account has been suspended" });
    }

    // Log successful login session
    await createAuditLog(req, {
      action: `User successfully logged in [${user.email}]`,
      module: "AUTH",
      status: "success",
    });

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        role: user.role,
        token: generateToken(user._id, user.tokenVersion),
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    await createAuditLog(req, {
      action: `Login process error: ${error.message}`,
      module: "AUTH",
      status: "failed",
    });
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update current logged-in user's profile
// @route   PUT /api/auth/me
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { name, username, email, phone } = req.body;

    if (username && username !== user.username) {
      const usernameTaken = await User.findOne({ username: username.toLowerCase() });
      if (usernameTaken) {
        return res
          .status(400)
          .json({ success: false, message: "Username is already taken" });
      }
      user.username = username;
    }

    if (email && email !== user.email) {
      const normalizedEmail = email.trim().toLowerCase();
      const emailTaken = await User.findOne({ email: normalizedEmail });
      if (emailTaken) {
        return res
          .status(400)
          .json({ success: false, message: "Email is already in use" });
      }
      user.email = normalizedEmail;
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (req.file) user.profilePicture = req.file.path;

    const updatedUser = await user.save();

    await createAuditLog(req, {
      action: `User updated profile information [${updatedUser.email}]`,
      module: "PROFILE",
      status: "success",
      details: { updatedFields: Object.keys(req.body) },
    });

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
        profilePicture: updatedUser.profilePicture,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    await createAuditLog(req, {
      action: `Profile update failed: ${error.message}`,
      module: "PROFILE",
      status: "failed",
    });
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe, updateProfile };