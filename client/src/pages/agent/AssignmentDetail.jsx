import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  ShieldCheck,
  Building,
  MapPin,
  FileText,
  File,
  ExternalLink,
  Check,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import API from "../../api";

const DOCUMENT_LABELS = {
  national_id: "National ID / Passport",
  passport_photo: "Passport Photo",
  employment_letter: "Employment Letter",
  bank_statement: "Bank Statement",
  kra_pin: "KRA PIN",
  guarantor_document: "Guarantor Document",
  other: "Other Attachment",
};

const isImage = (url) => {
  if (!url || typeof url !== "string") return false;
  return /\.(jpe?g|png|webp|gif)($|\?)/i.test(url);
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

const formatCurrency = (amount) => {
  const num = Number(amount);
  return isNaN(num) ? "KES 0" : `KES ${num.toLocaleString()}`;
};

const AssignmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifyingDocId, setVerifyingDocId] = useState(null);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearFeedback = () => {
    setError("");
    setSuccess("");
  };

  const fetchAssignment = useCallback(async () => {
    setLoading(true);
    clearFeedback();
    try {
      const { data } = await API.get(`/assignments/${id}`);
      setAssignment(data?.data || data);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Could not load this assignment details."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]);

  const handleVerifyDocument = async (docId) => {
    clearFeedback();
    setVerifyingDocId(docId);
    try {
      await API.put(`/assignments/${id}/documents/${docId}/verify`);
      setSuccess("Document verified successfully.");
      await fetchAssignment();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to verify document.");
    } finally {
      setVerifyingDocId(null);
    }
  };

  const handleApprove = async () => {
    clearFeedback();
    setApproving(true);
    try {
      await API.put(`/assignments/${id}/approve`);
      setSuccess("Assignment approved! Unit has been marked as occupied.");
      await fetchAssignment();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to approve assignment.");
    } finally {
      setApproving(false);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "lease_active":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Lease Active
          </span>
        );
      case "documents_verified":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Documents Verified
          </span>
        );
      case "terminated":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
            <XCircle className="w-3.5 h-3.5" />
            Terminated
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 capitalize">
            <Clock className="w-3.5 h-3.5" />
            {status ? status.replace(/_/g, " ") : "Pending"}
          </span>
        );
    }
  };

  // Skeleton Loading State
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="h-6 w-48 bg-muted rounded animate-pulse" />
        <div className="bg-card border border-border rounded-xl p-6 h-72 animate-pulse space-y-4">
          <div className="h-8 w-1/3 bg-muted rounded" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-12 bg-muted/60 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Fatal Initial Error State
  if (error && !assignment) {
    return (
      <div className="max-w-2xl mx-auto p-6 my-12 text-center bg-card border border-border rounded-xl shadow-xs">
        <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">
          Unable to Load Assignment
        </h3>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>
      </div>
    );
  }

  if (!assignment) return null;

  const documents = Array.isArray(assignment.documents) ? assignment.documents : [];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Breadcrumb Header Navigation */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link
          to="/agent-dashboard?tab=assignments"
          className="hover:text-primary font-medium transition-colors"
        >
          Tenant Assignments
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-foreground font-semibold truncate">
          {assignment.property?.title || "Assignment Details"}
        </span>
      </nav>

      {/* Global Action Banners */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-xs sm:text-sm font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-destructive" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs sm:text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Assignment Overview Card */}
      <div className="bg-card text-card-foreground border border-border rounded-xl p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {assignment.property?.title || "Property Unit"}
            </h1>
            <p className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mt-1">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>
                {[assignment.property?.estate, assignment.property?.county]
                  .filter(Boolean)
                  .join(", ") || "Location Unspecified"}
              </span>
            </p>
          </div>
          <div>{renderStatusBadge(assignment.status)}</div>
        </div>

        {/* Info Key-Value Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
          {/* Tenant Name */}
          <div className="p-3.5 rounded-lg bg-muted/50 border border-border">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <User className="w-3.5 h-3.5" />
              Tenant
            </span>
            <span className="font-semibold text-foreground block truncate">
              {assignment.tenant?.name || "Unassigned"}
            </span>
          </div>

          {/* Tenant Phone */}
          <div className="p-3.5 rounded-lg bg-muted/50 border border-border">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Phone className="w-3.5 h-3.5" />
              Phone
            </span>
            <span className="font-semibold text-foreground block truncate">
              {assignment.tenant?.phone || "—"}
            </span>
          </div>

          {/* Tenant Email */}
          <div className="p-3.5 rounded-lg bg-muted/50 border border-border">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Mail className="w-3.5 h-3.5" />
              Email
            </span>
            <span className="font-semibold text-foreground block truncate">
              {assignment.tenant?.email || "—"}
            </span>
          </div>

          {/* Monthly Rent */}
          <div className="p-3.5 rounded-lg bg-muted/50 border border-border">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <CreditCard className="w-3.5 h-3.5" />
              Monthly Rent
            </span>
            <span className="font-semibold text-primary block truncate">
              {formatCurrency(assignment.monthlyRent)}
            </span>
          </div>

          {/* Security Deposit */}
          <div className="p-3.5 rounded-lg bg-muted/50 border border-border">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Security Deposit
            </span>
            <span className="font-semibold text-foreground block truncate">
              {formatCurrency(assignment.securityDeposit)}
            </span>
          </div>

          {/* Lease Start */}
          <div className="p-3.5 rounded-lg bg-muted/50 border border-border">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Calendar className="w-3.5 h-3.5" />
              Lease Start
            </span>
            <span className="font-semibold text-foreground block truncate">
              {formatDate(assignment.leaseStartDate)}
            </span>
          </div>

          {/* Lease End */}
          <div className="p-3.5 rounded-lg bg-muted/50 border border-border">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Calendar className="w-3.5 h-3.5" />
              Lease End
            </span>
            <span className="font-semibold text-foreground block truncate">
              {formatDate(assignment.leaseEndDate)}
            </span>
          </div>

          {/* Payment Frequency */}
          <div className="p-3.5 rounded-lg bg-muted/50 border border-border">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Clock className="w-3.5 h-3.5" />
              Payment Frequency
            </span>
            <span className="font-semibold text-foreground block capitalize truncate">
              {assignment.paymentFrequency || "Monthly"}
            </span>
          </div>
        </div>

        {/* Property Notes Section */}
        {assignment.notes && (
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <span className="text-xs font-bold text-foreground block mb-1">
              Assignment Notes
            </span>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {assignment.notes}
            </p>
          </div>
        )}

        {/* View Property Link */}
        <div className="pt-2">
          <Link
            to={`/properties/${assignment.property?._id}`}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-card border border-border hover:bg-muted text-foreground rounded-lg transition-colors"
          >
            <Building className="w-4 h-4 text-primary" />
            <span>View Full Property Details</span>
          </Link>
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-card text-card-foreground border border-border rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>Uploaded Documents</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {documents.length}
            </span>
          </h3>
        </div>

        {documents.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-border text-muted-foreground text-xs sm:text-sm">
            No tenant documents uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => {
              const isVerifyingThisDoc = verifyingDocId === doc._id;

              return (
                <div
                  key={doc._id}
                  className="p-4 rounded-xl border border-border bg-card flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-xs text-foreground truncate">
                      {DOCUMENT_LABELS[doc.type] || doc.type}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        doc.verified
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {doc.verified ? "Verified" : "Pending"}
                    </span>
                  </div>

                  {/* Document Preview Box */}
                  <div className="h-40 w-full rounded-lg bg-muted overflow-hidden flex items-center justify-center relative border border-border">
                    {isImage(doc.url) ? (
                      <img
                        src={doc.url}
                        alt={DOCUMENT_LABELS[doc.type] || doc.type}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <File className="w-8 h-8" />
                        <span className="text-xs">Document File</span>
                      </div>
                    )}
                  </div>

                  {/* Document Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
                    >
                      <span>Open File</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {!doc.verified && (
                      <button
                        type="button"
                        onClick={() => handleVerifyDocument(doc._id)}
                        disabled={isVerifyingThisDoc}
                        className="inline-flex items-center justify-center gap-1 py-1.5 px-3 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer disabled:opacity-60"
                      >
                        {isVerifyingThisDoc ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Verify</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <span className="text-[10px] text-muted-foreground block text-right">
                    Uploaded {formatDate(doc.uploadedAt)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Global Approval Action Trigger */}
        {assignment.status === "documents_verified" && (
          <div className="pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleApprove}
              disabled={approving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {approving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Approving & Occupying Unit...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Assign Unit</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentDetail;