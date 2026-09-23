import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  Key,
  Building,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "tenant",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(""); // Clear error on edit
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await register(formData);
      if (result && !result.success) {
        setError(
          result.error ||
          "Failed to create account. Please check your details."
        );
      }
    } catch (err) {
      setError(
        err.message || "An unexpected error occurred during registration."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="auth-hero flex-1 p-6 sm:p-12 lg:p-16 flex flex-col justify-between bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white relative overflow-hidden">
        {/* Subtle Decorative Background Element */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <span className="role-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-6">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            New Workspace Access
          </span>

          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight mb-4 text-white">
            Create a property management account with the right role.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Register as a tenant or agent and enter the same secure operational
            system used across listings, occupancy, and payment workflows.
          </p>
        </div>

        {/* Workspace Roles Metric Breakdown */}
        <div className="auth-metric-grid grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-800 relative z-10">
          <div className="auth-metric p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <strong className="text-sm font-bold text-slate-100">
                Agent
              </strong>
            </div>
            <p className="text-xs text-slate-400">List and manage units</p>
          </div>

          <div className="auth-metric p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <Key className="w-4 h-4 text-indigo-400" />
              <strong className="text-sm font-bold text-slate-100">
                Tenant
              </strong>
            </div>
            <p className="text-xs text-slate-400">Pay and report issues</p>
          </div>

          <div className="auth-metric p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <Building className="w-4 h-4 text-purple-400" />
              <strong className="text-sm font-bold text-slate-100">
                Admin
              </strong>
            </div>
            <p className="text-xs text-slate-400">Govern the system</p>
          </div>
        </div>
      </section>

      {/* Auth Form Card */}
      <section className="auth-card flex-1 flex flex-col justify-center p-6 sm:p-12 lg:p-16 max-w-xl mx-auto w-full">
        <div className="mb-6">
          <h2 className="dashboard-title text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
            Create Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Fill in your credentials to request workspace access.
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="auth-error flex items-center gap-2.5 p-3.5 mb-6 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="dashboard-form-stack space-y-4"
        >
          {/* Full Name */}
          <div>
            <label
              className="dashboard-label required text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block"
              htmlFor="name"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                placeholder="Jane Doe"
                onChange={handleChange}
                required
                disabled={loading}
                className="dashboard-input w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 transition-colors"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label
              className="dashboard-label required text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                placeholder="name@example.com"
                onChange={handleChange}
                required
                disabled={loading}
                className="dashboard-input w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 transition-colors"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label
              className="dashboard-label required text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                placeholder="+254700000000"
                onChange={handleChange}
                required
                disabled={loading}
                className="dashboard-input w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              className="dashboard-label required text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                placeholder="Create a secure password"
                onChange={handleChange}
                required
                minLength={8}
                disabled={loading}
                className="dashboard-input w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <span className="dashboard-subtitle text-[11px] text-slate-400 mt-1 block">
              Use at least 8 characters.
            </span>
          </div>

          {/* Account Role Selection */}
          <div>
            <label className="dashboard-label required text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              Select Account Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Tenant Card Choice */}
              <button
                type="button"
                onClick={() => handleRoleSelect("tenant")}
                disabled={loading}
                className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  formData.role === "tenant"
                    ? "bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <Key
                  className={`w-4 h-4 ${formData.role === "tenant" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}
                />
                <div>
                  <div className="text-xs font-bold">Tenant</div>
                  <div className="text-[10px] text-slate-400">
                    Rent & pay bills
                  </div>
                </div>
              </button>

              {/* Agent Card Choice */}
              <button
                type="button"
                onClick={() => handleRoleSelect("agent")}
                disabled={loading}
                className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  formData.role === "agent"
                    ? "bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <UserCheck
                  className={`w-4 h-4 ${formData.role === "agent" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}
                />
                <div>
                  <div className="text-xs font-bold">Agent</div>
                  <div className="text-[10px] text-slate-400">
                    Manage listings
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="dashboard-btn dashboard-btn--secondary w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating account…</span>
              </>
            ) : (
              <>
                <span>Register</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="dashboard-subtitle text-xs text-center text-slate-500 dark:text-slate-400 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          Already registered?{" "}
          <Link
            to="/login"
            className="dashboard-link font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Login here
          </Link>
        </p>
      </section>
    </div>
  );
};

export default Register;