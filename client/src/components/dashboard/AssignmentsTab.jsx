import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  UserCheck,
  UserPlus,
  Home,
  Calendar,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Key,
  User,
  Mail,
  Phone,
  Loader2,
  ArrowRight,
  FileCheck2,
  Clock,
  ClipboardList,
} from "lucide-react";
import API from "../../api";

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "lease_active":
      return "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80";
    case "documents_verified":
      return "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/80";
    case "terminated":
      return "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/80";
    default:
      return "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/80";
  }
};

const formatStatus = (status) => (status ? status.replace(/_/g, " ") : "");

const AssignmentsTab = ({ registeredTenants = [] }) => {
  const [availableUnits, setAvailableUnits] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newCredentials, setNewCredentials] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const [tenantMode, setTenantMode] = useState(
    registeredTenants && registeredTenants.length > 0 ? "existing" : "new"
  );

  const [form, setForm] = useState({
    propertyId: "",
    tenantId: "",
    tenantName: "",
    tenantEmail: "",
    tenantPhone: "",
    leaseStartDate: "",
    leaseEndDate: "",
    monthlyRent: "",
    securityDeposit: "",
    billingDay: "1",
    paymentFrequency: "monthly",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const clearFeedback = () => {
    setError("");
    setSuccess("");
  };

  const fetchData = async () => {
    setLoading(true);
    clearFeedback();
    try {
      const [unitsRes, assignmentsRes] = await Promise.all([
        API.get("/assignments/available-units"),
        API.get("/assignments"),
      ]);
      setAvailableUnits(unitsRes.data.data || []);
      setAssignments(assignmentsRes.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Could not load assignments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    clearFeedback();
    setNewCredentials(null);
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (tenantMode === "existing") {
        delete payload.tenantName;
        delete payload.tenantEmail;
        delete payload.tenantPhone;
      } else {
        delete payload.tenantId;
      }

      const { data } = await API.post("/assignments", payload);

      if (data.newTenantCredentials) {
        setNewCredentials(data.newTenantCredentials);
      }

      setSuccess("Assignment created successfully! The tenant can now upload verification documents.");
      setForm({
        propertyId: "",
        tenantId: "",
        tenantName: "",
        tenantEmail: "",
        tenantPhone: "",
        leaseStartDate: "",
        leaseEndDate: "",
        monthlyRent: "",
        securityDeposit: "",
        billingDay: "1",
        paymentFrequency: "monthly",
        notes: "",
      });
      fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create assignment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (assignmentId) => {
    clearFeedback();
    try {
      await API.put(`/assignments/${assignmentId}/approve`);
      setSuccess("Assignment approved! Unit is now marked as occupied.");
      fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to approve assignment.");
    }
  };

  /* Skeleton Loading State */
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-44 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800" />
        <div className="h-64 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Alert Messages */}
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="font-medium">{success}</span>
        </div>
      )}

      {/* New Tenant Credentials Box */}
      {newCredentials && (
        <div className="relative overflow-hidden bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider">
            <Key className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>New Tenant Account Credentials</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Share these generated login details with the tenant. They should sign in and update their password immediately under Account Settings.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/60 text-xs">
              <div className="min-w-0 pr-2">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Email</span>
                <code className="font-mono text-slate-800 dark:text-slate-200 font-semibold truncate block">
                  {newCredentials.email}
                </code>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(newCredentials.email, "email")}
                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shrink-0 cursor-pointer"
                title="Copy Email"
              >
                {copiedField === "email" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/60 text-xs">
              <div className="min-w-0 pr-2">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Temporary Password</span>
                <code className="font-mono text-slate-800 dark:text-slate-200 font-semibold truncate block">
                  {newCredentials.temporaryPassword}
                </code>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(newCredentials.temporaryPassword, "password")}
                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shrink-0 cursor-pointer"
                title="Copy Password"
              >
                {copiedField === "password" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Assignment Form Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-indigo-500" />
          <span>Assign Tenant to Unit</span>
        </h3>

        {/* Tenant Mode Segmented Control Switch */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold">
          <button
            type="button"
            className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
              tenantMode === "existing"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
            onClick={() => setTenantMode("existing")}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Existing Registered Tenant</span>
          </button>
          <button
            type="button"
            className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
              tenantMode === "new"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
            onClick={() => setTenantMode("new")}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register New Tenant</span>
          </button>
        </div>

        <form onSubmit={handleCreateAssignment} className="space-y-3.5 pt-1">
          {/* Unit Selection */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Home className="w-3 h-3 text-indigo-500" />
              Available Unit <span className="text-rose-500">*</span>
            </label>
            <select
              name="propertyId"
              value={form.propertyId}
              onChange={handleFormChange}
              required
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white text-slate-800 outline-none transition-all"
            >
              <option value="">
                {availableUnits.length === 0 ? "No vacant units available" : "Select a property unit..."}
              </option>
              {availableUnits.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.title} — {u.estate}, {u.county}
                </option>
              ))}
            </select>
            {availableUnits.length === 0 && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                No properties are currently vacant or vacating soon. Mark a unit vacant from "My Properties" or Occupancy settings first.
              </p>
            )}
          </div>

          {/* Tenant Info Input Section */}
          {tenantMode === "existing" ? (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <User className="w-3 h-3 text-indigo-500" />
                Select Tenant <span className="text-rose-500">*</span>
              </label>
              <select
                name="tenantId"
                value={form.tenantId}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white text-slate-800 outline-none transition-all"
              >
                <option value="">
                  {registeredTenants.length === 0 ? "No registered tenants found" : "Select registered tenant..."}
                </option>
                {registeredTenants.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name} ({t.email})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-0.5">
                  Tenant Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="tenantName"
                  value={form.tenantName}
                  onChange={handleFormChange}
                  placeholder="e.g. Jane Wanjiru"
                  required
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white placeholder-slate-400 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-0.5">
                  Tenant Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="tenantEmail"
                  value={form.tenantEmail}
                  onChange={handleFormChange}
                  placeholder="jane@example.com"
                  required
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white placeholder-slate-400 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-0.5">
                  Tenant Phone Number
                </label>
                <input
                  type="text"
                  name="tenantPhone"
                  value={form.tenantPhone}
                  onChange={handleFormChange}
                  placeholder="+254 700 000000"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white placeholder-slate-400 outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Lease Details Fieldset */}
          <div className="pt-1 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block flex items-center gap-1">
              <Calendar className="w-3 h-3 text-indigo-500" /> Lease & Financial Terms
            </span>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-0.5">
                Lease Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="leaseStartDate"
                value={form.leaseStartDate}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white text-slate-800 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-0.5">
                Lease End Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="leaseEndDate"
                value={form.leaseEndDate}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white text-slate-800 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-0.5">
                Monthly Rent (KES) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="monthlyRent"
                value={form.monthlyRent}
                onChange={handleFormChange}
                min="0"
                placeholder="25000"
                required
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white placeholder-slate-400 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-0.5">
                Security Deposit (KES)
              </label>
              <input
                type="number"
                name="securityDeposit"
                value={form.securityDeposit}
                onChange={handleFormChange}
                min="0"
                placeholder="25000"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white placeholder-slate-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* Billing Configuration Fieldset */}
          <div className="pt-1 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-indigo-500" /> Billing Settings
            </span>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-0.5">
                Billing Day of Month (1 - 31)
              </label>
              <input
                type="number"
                name="billingDay"
                value={form.billingDay}
                onChange={handleFormChange}
                min="1"
                max="31"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-0.5">
                Payment Frequency
              </label>
              <select
                name="paymentFrequency"
                value={form.paymentFrequency}
                onChange={handleFormChange}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white text-slate-800 outline-none transition-all"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="biannual">Biannual</option>
                <option value="annual">Annual</option>
              </select>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-0.5">
              Additional Notes & Conditions
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleFormChange}
              rows={2}
              placeholder="Any special terms or conditions for this assignment..."
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white placeholder-slate-400 outline-none resize-y min-h-[50px] transition-all"
            />
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] rounded-xl shadow-xs shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Creating Assignment...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Assignment</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Existing Assignments List Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-indigo-500" />
            <span>Assignments List ({assignments.length})</span>
          </h3>
        </div>

        {assignments.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              No assignments recorded yet. Fill out the form above to assign a tenant.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {assignments.map((a) => (
              <div
                key={a._id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all space-y-3"
              >
                {/* Assignment Header & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {a.property?.title || "Property Unit"}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {a.tenant?.name || "Unassigned Tenant"} • {a.tenant?.phone || "No phone"}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeClass(
                      a.status
                    )}`}
                  >
                    {formatStatus(a.status)}
                  </span>
                </div>

                {/* Verification Document Info */}
                {a.documents && a.documents.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
                    <FileCheck2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>
                      {a.documents.filter((d) => d.verified).length} of {a.documents.length} documents verified
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Link
                    to={`/assignments/${a._id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs transition-all"
                  >
                    <span>View Details & Documents</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </Link>

                  {a.status === "documents_verified" && (
                    <button
                      type="button"
                      onClick={() => handleApprove(a._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Approve & Assign Unit</span>
                    </button>
                  )}
                </div>

                {/* Date Created Footer */}
                {a.assignedAt && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-200/50 dark:border-slate-800">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>
                      Assigned on{" "}
                      {new Date(a.assignedAt).toLocaleDateString("en-KE", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

AssignmentsTab.propTypes = {
  registeredTenants: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      email: PropTypes.string,
    })
  ),
};

export default AssignmentsTab;