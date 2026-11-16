import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building,
  Eye,
  EyeOff,
  Key,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  UserCheck,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import AuthScene from "@/components/auth/AuthScene";
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

const AUTH_METRICS = [
  { Icon: UserCheck, value: "Agent", label: "List and manage units" },
  { Icon: Key, value: "Tenant", label: "Pay and report issues" },
  { Icon: Building, value: "Admin", label: "Govern the system" },
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
    if (error) setError("");
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
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 sm:p-6">
        <Link
          to="/landing"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/80 px-3 py-2 text-xs font-semibold text-text-secondary backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-surface-soft hover:text-foreground hover:shadow-soft"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to site
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="hidden flex-1 lg:block">
          <AuthScene
            badge="New workspace access"
            title="Create a property management account with the right role."
            subtitle="Register as a tenant or agent and enter the same secure operational system used across listings, occupancy, and payment workflows."
            metrics={AUTH_METRICS}
          />
        </div>

        <section className="mx-auto w-full max-w-xl flex-1 p-4 pt-24 sm:p-8 lg:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-6">
              <h2 className="mb-1 text-2xl font-bold tracking-tight text-foreground">
                Create Account
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Fill in your credentials to request workspace access.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="auth-error mb-5 overflow-hidden"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="dashboard-form-stack">
              <div>
                <label className="dashboard-label required" htmlFor="name">
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

              <div>
                <label className="dashboard-label required" htmlFor="email">
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

              <div>
                <label className="dashboard-label required" htmlFor="phone">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    placeholder="+254 700 000 000"
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className={fieldClass}
                  />
                </div>
              </div>

              <div>
                <label className="dashboard-label required" htmlFor="password">
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
                    onClick={() => setShowPassword((v) => !v)}
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

              <div>
                <label className="dashboard-label required mb-2">
                  Select Account Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {ROLE_OPTIONS.map(({ value, label, description, Icon }) => {
                    const isActive = formData.role === value;
                    return (
                      <motion.button
                        key={value}
                        type="button"
                        onClick={() => handleRoleSelect(value)}
                        disabled={loading}
                        whileTap={{ scale: 0.97 }}
                        aria-pressed={isActive}
                        className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 text-left transition-all ${
                          isActive
                            ? "border-brand-blue bg-brand-very-light-blue text-brand-blue shadow-soft ring-1 ring-brand-blue"
                            : "border-border bg-surface text-text-secondary hover:-translate-y-0.5 hover:bg-surface-soft hover:shadow-soft"
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
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="dashboard-btn dashboard-btn--primary mt-2 w-full cursor-pointer justify-center gap-2 rounded-xl py-3 disabled:cursor-not-allowed disabled:opacity-60"
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

            <p className="mt-6 border-t border-border pt-4 text-center text-xs text-muted-foreground">
              Already registered?{" "}
              <Link
                to="/login"
                className="dashboard-link font-semibold text-brand-blue hover:underline"
              >
                Login here
              </Link>
            </p>

            <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              Role-based access is applied as soon as your account is created.
            </p>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Register;
