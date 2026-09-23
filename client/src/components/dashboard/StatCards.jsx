import React from 'react';
import PropTypes from 'prop-types';
import { 
  TrendingUp, 
  AlertTriangle, 
  Receipt, 
  ShieldAlert 
} from 'lucide-react';
import Card from '../common/Card';

// Currency Formatter Helper
const formatCurrency = (val, currency = 'KES') => {
  const numericVal = Number(val);
  if (isNaN(numericVal)) return `${currency} 0`;
  return `${currency} ${numericVal.toLocaleString('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const StatCards = ({ financials = {}, loading = false, className = '' }) => {
  const {
    totalIncome = 0,
    totalArrears = 0,
    totalExpenses = 0,
    totalLiabilities = 0,
  } = financials;

  const cards = [
    {
      id: 'income',
      title: 'Total Income',
      subtitle: 'Collected Rent',
      value: totalIncome,
      icon: TrendingUp,
      borderClass: 'border-l-4 border-emerald-500 dark:border-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'arrears',
      title: 'Tenant Arrears',
      subtitle: 'Pending Rent',
      value: totalArrears,
      icon: AlertTriangle,
      borderClass: 'border-l-4 border-amber-500 dark:border-amber-400',
      iconBg: 'bg-amber-50 dark:bg-amber-950/60',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      id: 'expenses',
      title: 'Total Expenses',
      subtitle: 'Paid Expenses',
      value: totalExpenses,
      icon: Receipt,
      borderClass: 'border-l-4 border-blue-500 dark:border-blue-400',
      iconBg: 'bg-blue-50 dark:bg-blue-950/60',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 'liabilities',
      title: 'Liabilities',
      subtitle: 'Outstanding Unpaid',
      value: totalLiabilities,
      icon: ShieldAlert,
      borderClass: 'border-l-4 border-rose-500 dark:border-rose-400',
      iconBg: 'bg-rose-50 dark:bg-rose-950/60',
      iconColor: 'text-rose-600 dark:text-rose-400',
    },
  ];

  /* Loading Skeleton View */
  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <Card key={i} padding="normal" hover={false} className="animate-pulse bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="flex items-start justify-between space-x-3">
              <div className="space-y-2.5 flex-1">
                <div className="h-3 bg-slate-200 dark:bg-slate-700/80 rounded-md w-1/2" />
                <div className="h-6 bg-slate-200 dark:bg-slate-700/80 rounded-md w-3/4" />
                <div className="h-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-md w-1/3" />
              </div>
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700/80 rounded-xl shrink-0" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  /* Stat Cards View */
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 ${className}`}>
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card 
            key={card.id}
            padding="normal"
            hover
            className={`${card.borderClass} transition-all duration-200 hover:shadow-md bg-white dark:bg-slate-900 border-y border-r border-slate-200 dark:border-slate-800/80 rounded-xl overflow-hidden`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                  {card.title}
                </p>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 truncate tracking-tight">
                  {formatCurrency(card.value)}
                </p>
                {card.subtitle && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium truncate">
                    {card.subtitle}
                  </p>
                )}
              </div>

              <div className={`p-2.5 rounded-xl ${card.iconBg} ${card.iconColor} shrink-0 border border-transparent dark:border-slate-800 shadow-xs`}>
                <Icon className="w-5 h-5" strokeWidth={1.75} />
              </div>
            </div>
          </Card>
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