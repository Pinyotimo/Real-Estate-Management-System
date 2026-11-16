import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { AlertTriangle, Receipt, ShieldAlert, TrendingUp } from "lucide-react";
import Card from "../common/Card";

const formatCurrency = (val, currency = "KES") => {
  const numericVal = Number(val);
  if (Number.isNaN(numericVal)) return `${currency} 0`;
  return `${currency} ${numericVal.toLocaleString("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const AnimatedMoney = ({ value }) => {
  const [display, setDisplay] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return undefined;
    }
    const start = performance.now();
    const duration = 900;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [value]);

  return <span className="tabular-nums">{formatCurrency(display)}</span>;
};

const StatCards = ({ financials = {}, loading = false, className = "" }) => {
  const {
    totalIncome = 0,
    totalArrears = 0,
    totalExpenses = 0,
    totalLiabilities = 0,
  } = financials;

  const cards = [
    {
      id: "income",
      title: "Total Income",
      subtitle: "Collected rent",
      value: totalIncome,
      icon: TrendingUp,
      iconClass: "bg-success/10 text-success",
    },
    {
      id: "arrears",
      title: "Tenant Arrears",
      subtitle: "Pending rent",
      value: totalArrears,
      icon: AlertTriangle,
      iconClass: "bg-warning/10 text-warning",
    },
    {
      id: "expenses",
      title: "Total Expenses",
      subtitle: "Paid expenses",
      value: totalExpenses,
      icon: Receipt,
      iconClass: "bg-brand-very-light-blue text-brand-blue",
    },
    {
      id: "liabilities",
      title: "Liabilities",
      subtitle: "Outstanding unpaid",
      value: totalLiabilities,
      icon: ShieldAlert,
      iconClass: "bg-danger/10 text-danger",
    },
  ];

  if (loading) {
    return (
      <div
        className={`grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 ${className}`}
        aria-busy="true"
      >
        {[...Array(4)].map((_, i) => (
          <Card
            key={i}
            padding="normal"
            hover={false}
            className="animate-pulse border border-border bg-card"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2.5">
                <div className="h-3 w-1/2 rounded-md bg-surface-muted" />
                <div className="h-6 w-3/4 rounded-md bg-surface-muted" />
                <div className="h-2.5 w-1/3 rounded-md bg-surface-muted" />
              </div>
              <div className="h-10 w-10 shrink-0 rounded-xl bg-surface-muted" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 ${className}`}>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card
              padding="normal"
              hover
              className="card-shine tilt-card group border border-border bg-card shadow-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    {card.title}
                  </p>
                  <p className="mt-1 truncate text-xl font-extrabold tracking-tight text-text-primary sm:text-2xl">
                    <AnimatedMoney value={card.value} />
                  </p>
                  {card.subtitle && (
                    <p className="mt-0.5 truncate text-xs font-medium text-text-muted">
                      {card.subtitle}
                    </p>
                  )}
                </div>
                <div
                  className={`shrink-0 rounded-xl p-2.5 shadow-xs transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 ${card.iconClass}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

StatCards.propTypes = {
  financials: PropTypes.shape({
    totalIncome: PropTypes.number,
    totalArrears: PropTypes.number,
    totalExpenses: PropTypes.number,
    totalLiabilities: PropTypes.number,
  }),
  loading: PropTypes.bool,
  className: PropTypes.string,
};

export default StatCards;
