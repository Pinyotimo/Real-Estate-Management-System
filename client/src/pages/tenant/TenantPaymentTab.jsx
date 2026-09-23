import React from "react";
import {
  CreditCard,
  Smartphone,
  Landmark,
  ShieldCheck,
  Lock,
  Coins,
  Loader2,
  ArrowRight,
} from "lucide-react";

const TenantPaymentTab = ({
  payForm = {},
  onPayFormChange,
  onSubmit,
  loading = false,
}) => {
  const isSubmitting = loading || payForm.submitting || payForm.loading;

  // Render contextual icon depending on payment method
  const getMethodIcon = (method) => {
    switch (method) {
      case "mpesa":
        return <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "card":
        return <CreditCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case "bank":
        return <Landmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <CreditCard className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="page-card max-w-lg w-full p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <h3 className="dashboard-section-title text-base font-bold text-slate-800 dark:text-slate-100 mb-0">
            Pay Rent or Bills
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select a category and payment method to proceed
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="dashboard-form-stack space-y-4">
        {/* Payment Type */}
        <div>
          <label className="dashboard-label text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
            Payment Type
          </label>
          <div className="relative">
            <select
              value={payForm.paymentType || "rent"}
              onChange={(e) => onPayFormChange("paymentType", e.target.value)}
              className="dashboard-select w-full pl-3 pr-8 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
              disabled={isSubmitting}
            >
              <option value="rent">Monthly Rent</option>
              <option value="service">Service Charge</option>
              <option value="water">Water Bill</option>
              <option value="electricity">Electricity Bill</option>
            </select>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="dashboard-label text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
            Amount
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-xs font-bold text-slate-400 pointer-events-none select-none">
              KES
            </span>
            <input
              type="number"
              value={payForm.amount || ""}
              onChange={(e) => onPayFormChange("amount", e.target.value)}
              required
              min="1"
              step="any"
              className="dashboard-input w-full pl-12 pr-3 py-2.5 text-sm font-semibold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="0.00"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="dashboard-label text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
            Payment Method
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 pointer-events-none">
              {getMethodIcon(payForm.paymentMethod || "mpesa")}
            </div>
            <select
              value={payForm.paymentMethod || "mpesa"}
              onChange={(e) => onPayFormChange("paymentMethod", e.target.value)}
              className="dashboard-select w-full pl-10 pr-8 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
              disabled={isSubmitting}
            >
              <option value="mpesa">M-Pesa / Mobile Money</option>
              <option value="card">Credit / Debit Card</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          {/* Contextual helper note for selected payment method */}
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-md border border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
            <Coins className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>
              {(payForm.paymentMethod || "mpesa") === "mpesa" &&
                "An M-Pesa STK prompt will be sent to your registered phone number."}
              {payForm.paymentMethod === "card" &&
                "You will be redirected to a secure card payment gateway."}
              {payForm.paymentMethod === "bank" &&
                "Direct bank transfer instructions will be generated upon confirmation."}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="dashboard-btn w-full mt-4 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing Payment…</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Process Secure Payment</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </>
          )}
        </button>
      </form>

      {/* Security Footer Notice */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2 text-slate-400 dark:text-slate-500 text-xs">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <p className="leading-tight text-[11px]">
          Payments are processed via an encrypted 256-bit SSL gateway. Digital receipts will be posted directly to your <strong>Receipts</strong> tab upon confirmation.
        </p>
      </div>
    </div>
  );
};

export default TenantPaymentTab;