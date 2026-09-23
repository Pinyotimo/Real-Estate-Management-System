import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api";
import {
  KeyRound,
  Sliders,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Shield,
  Lock,
  Save,
} from "lucide-react";

const SettingsPage = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  // ----- Password Change State -----
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);

  // ----- System Configuration State (Admin Only) -----
  const [systemConfig, setSystemConfig] = useState({
    allowRegistration: true,
    autoApproveListing: true,
    maintenanceMode: false,
    defaultCurrency: "KES",
  });
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [configMessage, setConfigMessage] = useState(null);

  // Fetch system configuration if user is admin
  useEffect(() => {
    if (!isAdmin) return;

    const fetchSystemSettings = async () => {
      setLoadingConfig(true);
      try {
        const response = await API.get("/admin/settings");
        if (response.data) {
          setSystemConfig((prev) => ({ ...prev, ...response.data }));
        }
      } catch (err) {
        // Silently retain defaults or notify if critical
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchSystemSettings();
  }, [isAdmin]);

  // Handlers for Password Change
  const handlePasswordChange = (e) =>
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (passwordForm.newPassword.length < 8) {
      setPasswordMessage({
        type: "error",
        text: "New password must be at least 8 characters long.",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New passwords do not match.",
      });
      return;
    }

    setSavingPassword(true);
    try {
      await API.put("/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMessage({
        type: "success",
        text: "Password updated successfully.",
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update password.",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  // Handlers for System Configuration
  const handleConfigToggle = (field) =>
    setSystemConfig((current) => ({ ...current, [field]: !current[field] }));

  const handleConfigChange = (e) =>
    setSystemConfig({ ...systemConfig, [e.target.name]: e.target.value });

  const handleConfigSubmit = async (e) => {
    e.preventDefault();
    setConfigMessage(null);
    setSavingConfig(true);

    try {
      await API.put("/admin/settings", systemConfig);
      setConfigMessage({
        type: "success",
        text: "System settings updated successfully.",
      });
    } catch (err) {
      setConfigMessage({
        type: "error",
        text:
          err.response?.data?.message || "Failed to update system settings.",
      });
    } finally {
      setSavingConfig(false);
    }
  };

  return (
    <div className="dashboard-shell space-y-6">
      <div className="flex items-center gap-3">
        <Sliders className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
        <h1 className="dashboard-title">Settings</h1>
      </div>

      {/* SECTION 1: Password Change (Available to all authenticated users) */}
      <div className="page-card">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="dashboard-section-title mb-0">Change Password</h2>
        </div>

        {/* Password Feedback Notification */}
        {passwordMessage && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg mb-4 text-xs font-medium ${
              passwordMessage.type === "error"
                ? "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50"
                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
            }`}
          >
            {passwordMessage.type === "error" ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            )}
            <span className="flex-1">{passwordMessage.text}</span>
            <button
              type="button"
              onClick={() => setPasswordMessage(null)}
              className="p-1 hover:opacity-75 cursor-pointer"
              aria-label="Dismiss message"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="dashboard-form-stack">
          {/* Current Password */}
          <div>
            <label className="dashboard-label required" htmlFor="currentPassword">
              Current Password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                name="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
                className="dashboard-input pr-10"
                disabled={savingPassword}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                aria-label={showPasswords.current ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPasswords.current ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="dashboard-label required" htmlFor="newPassword">
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
                className="dashboard-input pr-10"
                disabled={savingPassword}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                aria-label={showPasswords.new ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPasswords.new ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <span className="dashboard-subtitle mt-1 block">
              Password must be at least 8 characters.
            </span>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="dashboard-label required" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
                className="dashboard-input pr-10"
                disabled={savingPassword}
                placeholder="Re-enter new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                aria-label={showPasswords.confirm ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="dashboard-btn dashboard-btn--secondary inline-flex items-center gap-2"
            disabled={savingPassword}
            style={{ alignSelf: "flex-start" }}
          >
            {savingPassword ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating…</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* SECTION 2: System Configuration (Admin Only) */}
      {isAdmin && (
        <div className="page-card">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="dashboard-section-title mb-0">System Configuration</h2>
          </div>
          <p className="dashboard-subtitle mb-4">
            These settings apply platform-wide and affect all users.
          </p>

          {/* Configuration Feedback Notification */}
          {configMessage && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg mb-4 text-xs font-medium ${
                configMessage.type === "error"
                  ? "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50"
                  : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
              }`}
            >
              {configMessage.type === "error" ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              )}
              <span className="flex-1">{configMessage.text}</span>
              <button
                type="button"
                onClick={() => setConfigMessage(null)}
                className="p-1 hover:opacity-75 cursor-pointer"
                aria-label="Dismiss message"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {loadingConfig ? (
            <div className="flex items-center justify-center py-8 text-slate-500 text-xs gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              <span>Loading system configuration…</span>
            </div>
          ) : (
            <form onSubmit={handleConfigSubmit} className="dashboard-form-stack">
              <label className="dashboard-checkbox-label flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={systemConfig.allowRegistration}
                  onChange={() => handleConfigToggle("allowRegistration")}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                  disabled={savingConfig}
                />
                <span className="text-sm font-medium">Allow new user registration</span>
              </label>

              <label className="dashboard-checkbox-label flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={systemConfig.autoApproveListing}
                  onChange={() => handleConfigToggle("autoApproveListing")}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                  disabled={savingConfig}
                />
                <span className="text-sm font-medium">
                  Auto-approve new property listings (skip admin review)
                </span>
              </label>

              <label className="dashboard-checkbox-label flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={systemConfig.maintenanceMode}
                  onChange={() => handleConfigToggle("maintenanceMode")}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                  disabled={savingConfig}
                />
                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  Maintenance mode (blocks non-admin logins)
                </span>
              </label>

              <div>
                <label className="dashboard-label" htmlFor="defaultCurrency">
                  Default Currency
                </label>
                <select
                  id="defaultCurrency"
                  name="defaultCurrency"
                  className="dashboard-select"
                  value={systemConfig.defaultCurrency}
                  onChange={handleConfigChange}
                  disabled={savingConfig}
                >
                  <option value="KES">KES — Kenyan Shilling</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                </select>
              </div>

              <button
                type="submit"
                className="dashboard-btn dashboard-btn--success inline-flex items-center gap-2"
                disabled={savingConfig}
                style={{ alignSelf: "flex-start" }}
              >
                {savingConfig ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving…</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save System Settings</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default SettingsPage;