const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    role: {
      type: String,
      enum: ['tenant', 'agent', 'admin'],
      default: 'tenant',
    },
    suspended: { type: Boolean, default: false },
    suspendedAt: { type: Date, default: null },
    tokenVersion: { type: Number, default: 0 }, // bump to invalidate existing JWTs
    lastActiveAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// 🔑 Add matchPassword method to compare hashed passwords during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);