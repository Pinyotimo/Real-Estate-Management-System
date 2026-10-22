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
  ArrowLeft,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

const ROLE_OPTIONS = [
  {
    value: "tenant",
    label: "Tenant",
    description: "Rent & pay bills",
    Icon: Key,
  },
  {
    value: "agent",
    label: "Agent",
    description: "Manage listings",
    Icon: UserCheck,
  },
];

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

  const fieldClass =
    "w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-3 text-xs text-text-primary transition-colors placeholder:text-muted-foreground focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/25 disabled:opacity-60 sm:text-sm";

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Top bar: return to site + appearance control */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 sm:p-6">
        <Link
          to="/landing"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/80 px-3 py-2 text-xs font-semibold text-text-secondary backdrop-blur transition-colors hover:bg-surface-soft hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to site
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Hero Section */}
        <section className="auth-hero flex-1">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 h-96 w-96 rounded-full bg-white/10 blur-3xl"
          />

          <div className="relative z-10 max-w-xl">
            <span className="role-badge mb-6">
              <ShieldCheck className="h-3.5 w-3.5" />
              New Workspace Access
            </span>

            <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl xl:text-5xl">
              Create a property management account with the right role.
            </h1>

            <p className="text-sm leading-relaxed text-white/75 sm:text-base">
              Register as a tenant or agent and enter the same secure
              operational system used across listings, occupancy, and payment
              workflows.
            </p>
          </div>

          {/* Workspace Roles Metric Breakdown */}
          <div className="auth-metric-grid relative z-10 mt-8 border-t border-white/10 pt-8">
            <div className="auth-metric">
              <div className="mb-1 flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-emerald-300" />
                <strong className="text-sm font-bold text-white">Agent</strong>
              </div>
              <p className="text-xs text-white/60">List and manage units</p>
            </div>

            <div className="auth-metric">
              <div className="mb-1 flex items-center gap-2">
                <Key className="h-4 w-4 text-brand-light-blue" />
                <strong className="text-sm font-bold text-white">Tenant</strong>
              </div>
              <p className="text-xs text-white/60">Pay and report issues</p>
            </div>

            <div className="auth-metric">
              <div className="mb-1 flex items-center gap-2">
                <Building className="h-4 w-4 text-purple-300" />
                <strong className="text-sm font-bold text-white">Admin</strong>
              </div>
              <p className="text-xs text-white/60">Govern the system</p>
            </div>
          </div>
        </section>

        {/* Auth Form Card */}
        <section className="auth-card mx-auto w-full max-w-xl flex-1 pt-24 lg:pt-16">
          <div className="mb-6">
            <h2 className="mb-1 text-2xl font-bold tracking-tight text-foreground">
              Create Account
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Fill in your credentials to request workspace access.
            </p>
          </div>

          {/* Error Alert Box */}
          {error && (
            <div className="auth-error mb-6">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="dashboard-form-stack">
            {/* Full Name */}
            <div>
              <label
                className="dashboard-label required"
                htmlFor="name"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Jane Doe"
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className={fieldClass}
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label
                className="dashboard-label required"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="name@example.com"
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className={fieldClass}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label
                className="dashboard-label required"
                htmlFor="phone"
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  placeholder="+254700000000"
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className={fieldClass}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="dashboard-label required"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                  className={`${fieldClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <span className="mt-1 block text-[11px] text-muted-foreground">
                Use at least 8 characters.
              </span>
            </div>

            {/* Account Role Selection */}
            <div>
              <label className="dashboard-label required mb-2">
                Select Account Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ROLE_OPTIONS.map(({ value, label, description, Icon }) => {
                  const isActive = formData.role === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRoleSelect(value)}
                      disabled={loading}
                      aria-pressed={isActive}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 text-left transition-all ${
                        isActive
                          ? "border-brand-blue bg-brand-very-light-blue text-brand-blue ring-1 ring-brand-blue"
                          : "border-border bg-surface text-text-secondary hover:bg-surface-soft"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          isActive ? "text-brand-blue" : "text-muted-foreground"
                        }`}
                      />
                      <div>
                        <div className="text-xs font-bold">{label}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="dashboard-btn dashboard-btn--primary mt-2 w-full cursor-pointer justify-center gap-2 py-2.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating account…</span>
                </>
              ) : (
                <>
                  <span>Register</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-6 border-t border-border pt-4 text-center text-xs text-muted-foreground">
            Already registered?{" "}
            <Link
              to="/login"
              className="dashboard-link font-semibold text-brand-blue hover:underline"
            >
              Login here
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Register;
