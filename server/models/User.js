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

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  // Seed scripts may pass an already-hashed bcrypt value.
  if (/^\$2[aby]\$\d{2}\$/.test(this.password)) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);