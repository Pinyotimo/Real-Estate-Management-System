import React, { useEffect, useState } from "react";
import API from "../../api";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Building2,
  DollarSign,
  Loader2,
  X,
  FileCheck2,
  Info,
  Trash2,
} from "lucide-react";

const DOCUMENT_FIELDS = [
  { name: "national_id", label: "National ID / Passport", required: true },
  { name: "passport_photo", label: "Passport Photo", required: true },
  { name: "employment_letter", label: "Employment Letter", required: true },
  { name: "bank_statement", label: "Bank Statement", required: true },
  { name: "kra_pin", label: "KRA PIN (optional)", required: false },
  { name: "guarantor_document", label: "Guarantor Documents", required: false },
];

const TenantApplicationTab = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [files, setFiles] = useState({});
  const [uploading, setUploading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // Forces file input visual reset

  const clearFeedback = () => {
    setError("");
    setSuccess("");
  };

  const fetchAssignments = async () => {
    setLoading(true);
    clearFeedback();
    try {
      const { data } = await API.get("/assignments");
      setAssignments(data.data || []);
    } catch (err) {
      setError("Could not load your application status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleFileChange = (fieldName, file) => {
    setFiles((prev) => ({
      ...prev,
      [fieldName]: file || null,
    }));
  };

  const handleRemoveFile = (fieldName) => {
    setFiles((prev) => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
  };

  const handleUpload = async (assignmentId, uploadedTypes) => {
    clearFeedback();

    // 1. Check if any file is selected
    const selected = Object.entries(files).filter(([, file]) => Boolean(file));
    if (selected.length === 0) {
      setError("Select at least one document before uploading.");
      return;
    }

    // 2. Validate mandatory required fields
    const missingRequired = DOCUMENT_FIELDS.filter(
      (field) =>
        field.required &&
        !uploadedTypes.includes(field.name) &&
        !files[field.name]
    );

    if (missingRequired.length > 0) {
      const labels = missingRequired.map((f) => f.label).join(", ");
      setError(`Please provide the required document(s): ${labels}`);
      return;
    }

    const formData = new FormData();
    selected.forEach(([fieldName, file]) => formData.append(fieldName, file));

    setUploading(true);
    try {
      await API.post(`/assignments/${assignmentId}/documents`, formData);
      setSuccess("Documents uploaded successfully. Your agent will review them shortly.");
      setFiles({});
      setFileInputKey(Date.now()); // Reset file input elements visually
      fetchAssignments();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to upload documents.");
    } finally {
      setUploading(false);
    }
  };

  const formatStatus = (status) =>
    status ? status.replace(/_/g, " ") : "Pending";

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
        <span className="text-sm font-medium">Loading application status…</span>
      </div>
    );
  }

  const current = assignments.find(
    (a) => a.status !== "terminated" && a.status !== "renewed"
  );

  if (!current) {
    return (
      <div className="empty-state p-8 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200">
          No Pending Applications
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Your property agent will create an assignment here once a unit has been arranged for you.
        </p>
      </div>
    );
  }

  const uploadedTypes = (current.documents || []).map((d) => d.type);

  return (
    <div className="dashboard-stack space-y-6">
      {/* Alert Notifications */}
      {error && (
        <div className="flex items-center gap-2 p-3.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            className="p-1 hover:opacity-75 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span className="flex-1">{success}</span>
          <button
            type="button"
            onClick={() => setSuccess("")}
            className="p-1 hover:opacity-75 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Panel */}
      <div className="dashboard-panel page-card">
        {/* Header Summary */}
        <div className="dashboard-space-between flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <strong className="text-lg text-slate-800 dark:text-slate-100">
                {current.property?.title || "Assigned Property"}
              </strong>
            </div>
            <p className="dashboard-subtitle text-xs text-slate-500 mt-1">
              {[current.property?.estate, current.property?.county]
                .filter(Boolean)
                .join(", ") || "Location details unavailable"}
            </p>
          </div>

          <span className="dashboard-pill capitalize inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {formatStatus(current.status)}
          </span>
        </div>

        {/* Info Grid */}
        <div className="info-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <div className="info-cell flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Monthly Rent
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              KES {Number(current.monthlyRent || 0).toLocaleString()}
            </span>
          </div>

          <div className="info-cell flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Lease Start
            </span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {formatDate(current.leaseStartDate)}
            </span>
          </div>

          <div className="info-cell flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Lease End
            </span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {formatDate(current.leaseEndDate)}
            </span>
          </div>

          {current.assignedAt && (
            <div className="info-cell flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <FileCheck2 className="w-3.5 h-3.5 text-slate-400" /> Assigned On
              </span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {formatDate(current.assignedAt)}
              </span>
            </div>
          )}
        </div>

        {/* Document Upload Section */}
        {current.status === "lease_active" ? (
          <div className="mt-6 flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
            <Info className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Your lease is active. Access the <strong>"My Unit"</strong> tab for ongoing rent payments and maintenance requests.
            </span>
          </div>
        ) : (
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <UploadCloud className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="dashboard-section-title mb-0">Upload Required Documents</h3>
            </div>

            <div className="dashboard-form-grid grid grid-cols-1 md:grid-cols-2 gap-4">
              {DOCUMENT_FIELDS.map((field) => {
                const alreadyUploaded = uploadedTypes.includes(field.name);
                const currentFile = files[field.name];

                return (
                  <div key={field.name} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="dashboard-label text-xs font-medium text-slate-700 dark:text-slate-300 mb-0">
                        {field.label}
                        {field.required && <span className="text-rose-500 ml-0.5">*</span>}
                      </label>

                      {alreadyUploaded && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Uploaded
                        </span>
                      )}
                    </div>

                    <input
                      key={`${field.name}-${fileInputKey}`}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(field.name, e.target.files?.[0])}
                      className="dashboard-input text-xs"
                      disabled={uploading}
                    />

                    {currentFile && (
                      <div className="flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                        <span className="truncate max-w-[85%]">
                          Selected: {currentFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(field.name)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => handleUpload(current._id, uploadedTypes)}
              disabled={uploading}
              className="dashboard-btn dashboard-btn--success inline-flex items-center gap-2 mt-6 cursor-pointer disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading…</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Documents</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantApplicationTab;