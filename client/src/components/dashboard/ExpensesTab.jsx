import React, { useState } from 'react';
import { Input, Select } from '../common/Form';
import Button from '../common/Button';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { 
  Plus, 
  DollarSign, 
  Filter, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  AlertCircle,
  X
} from 'lucide-react';

const ExpensesTab = ({
  expenses = [],
  expenseForm = { title: '', amount: '', category: 'repairs', isLiability: false },
  onExpenseFormChange,
  onSubmitExpense,
  loading = false,
  error = null,
}) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(true);

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    const matchesType = 
      filter === 'all' ? true :
      filter === 'expenses' ? !expense.isLiability :
      expense.isLiability;
    const matchesSearch = 
      expense.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Calculate totals
  const totalExpenses = expenses.filter(e => !e.isLiability).reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalLiabilities = expenses.filter(e => e.isLiability).reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalAll = totalExpenses + totalLiabilities;

  // Category options
  const categoryOptions = [
    { value: 'repairs', label: '🔧 Repairs' },
    { value: 'utilities', label: '💡 Utilities' },
    { value: 'taxes', label: '📋 Taxes' },
    { value: 'maintenance', label: '🛠️ Maintenance' },
    { value: 'cleaning', label: '🧹 Cleaning' },
    { value: 'insurance', label: '🛡️ Insurance' },
    { value: 'supplies', label: '📦 Supplies' },
    { value: 'other', label: '📌 Other' },
  ];

  // Get category emoji
  const getCategoryEmoji = (category) => {
    const emojis = {
      repairs: '🔧',
      utilities: '💡',
      taxes: '📋',
      maintenance: '🛠️',
      cleaning: '🧹',
      insurance: '🛡️',
      supplies: '📦',
      other: '📌',
    };
    return emojis[category] || '📌';
  };

  return (
    <div className="dashboard-stack">
      {/* Page Header */}
      <div className="dashboard-space-between" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div>
          <h2 className="dashboard-title" style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
            Expenses & Liabilities
          </h2>
          <p className="dashboard-subtitle" style={{ marginBottom: '0' }}>
            Track and manage all property-related expenses
          </p>
        </div>
        <Button 
          size="sm" 
          icon={showForm ? X : Plus}
          variant={showForm ? 'outline' : 'primary'}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Hide Form' : 'Add Expense'}
        </Button>
      </div>

      {/* Stats Cards Grid */}
      <div className="stat-card-grid">
        {/* Total All */}
        <div className="stat-card">
          <div className="stat-card-top">
            <div style={{ flex: 1 }}>
              <p className="dashboard-card-title">Total All</p>
              <p className="dashboard-card-value" style={{ color: 'var(--brand-blue)' }}>
                KES {totalAll.toLocaleString()}
              </p>
            </div>
            <div className="stat-card-icon" style={{ background: 'var(--brand-very-light-blue)', color: 'var(--brand-blue)' }}>
              <Wallet size={24} />
            </div>
          </div>
        </div>

        {/* Expenses */}
        <div className="stat-card stat-card--success">
          <div className="stat-card-top">
            <div style={{ flex: 1 }}>
              <p className="dashboard-card-title">Expenses</p>
              <p className="dashboard-card-value" style={{ color: 'var(--color-green)' }}>
                KES {totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="stat-card-icon" style={{ background: 'var(--color-green-lighter)', color: 'var(--color-green)' }}>
              <TrendingDown size={24} />
            </div>
          </div>
        </div>

        {/* Liabilities */}
        <div className="stat-card" style={{ borderTopColor: 'var(--color-amber)' }}>
          <div className="stat-card-top">
            <div style={{ flex: 1 }}>
              <p className="dashboard-card-title">Liabilities</p>
              <p className="dashboard-card-value" style={{ color: 'var(--color-amber)' }}>
                KES {totalLiabilities.toLocaleString()}
              </p>
            </div>
            <div className="stat-card-icon" style={{ background: 'var(--color-amber-lighter)', color: 'var(--color-amber)' }}>
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        {/* Records Count */}
        <div className="stat-card" style={{ borderTopColor: 'var(--color-purple)' }}>
          <div className="stat-card-top">
            <div style={{ flex: 1 }}>
              <p className="dashboard-card-title">Records</p>
              <p className="dashboard-card-value">
                {expenses.length}
              </p>
            </div>
            <div className="stat-card-icon" style={{ background: 'var(--color-purple-lighter)', color: 'var(--color-purple)' }}>
              <Filter size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Form */}
      {showForm && (
        <Card title="Record New Expense or Liability" subtitle="Fill in the details below to track your property costs">
          <form onSubmit={onSubmitExpense} className="dashboard-form-stack">
            {error && (
              <div className="dashboard-panel" style={{ borderLeft: '4px solid var(--color-red)', background: 'var(--color-red-lighter)', color: 'var(--color-red)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                <span style={{ fontSize: '0.9rem' }}>{error}</span>
              </div>
            )}

            <div className="dashboard-form-grid">
              <div>
                <Input
                  label="Title"
                  name="title"
                  placeholder="e.g., WiFi Bill, Repairs"
                  value={expenseForm.title || ''}
                  onChange={(e) => onExpenseFormChange('title', e.target.value)}
                  required
                  icon={DollarSign}
                  size="md"
                />
              </div>

              <div>
                <Input
                  label="Amount (KES)"
                  name="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={expenseForm.amount || ''}
                  onChange={(e) => onExpenseFormChange('amount', e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  size="md"
                />
              </div>

              <div>
                <Select
                  label="Category"
                  name="category"
                  options={categoryOptions}
                  value={expenseForm.category || 'repairs'}
                  onChange={(e) => onExpenseFormChange('category', e.target.value)}
                  size="md"
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <label className="dashboard-checkbox-label">
                <input
                  type="checkbox"
                  checked={expenseForm.isLiability || false}
                  onChange={(e) => onExpenseFormChange('isLiability', e.target.checked)}
                  className="dashboard-checkbox"
                />
                <span>
                  Mark as Unpaid Liability
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  (will appear in liabilities)
                </span>
              </label>

              <div className="dashboard-inline-actions">
                <Button 
                  type="reset" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    onExpenseFormChange('title', '');
                    onExpenseFormChange('amount', '');
                    onExpenseFormChange('category', 'repairs');
                    onExpenseFormChange('isLiability', false);
                  }}
                >
                  Clear
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  icon={Plus}
                  loading={loading}
                >
                  Add Record
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      {/* Expenses List */}
      <Card 
        title="Logged Expenses & Liabilities"
        subtitle={
          <span className="dashboard-subtitle" style={{ marginBottom: '0' }}>
            {filteredExpenses.length} record{filteredExpenses.length !== 1 ? 's' : ''} found
            {filter !== 'all' && ` • Filtered by: ${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
          </span>
        }
        headerActions={
          <div className="dashboard-inline-actions" style={{ flexWrap: 'wrap' }}>
            {/* Search */}
            <div className="expenses-search-wrapper">
              <Search size={16} className="expenses-search-icon" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="expenses-search-input"
              />
            </div>

            {/* Filter Buttons */}
            <div className="dashboard-tabs" style={{ borderBottom: 'none', marginBottom: '0', gap: '0.25rem', padding: '0.25rem', background: 'var(--surface-soft)', borderRadius: 'var(--radius-sm)' }}>
              {['all', 'expenses', 'liabilities'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`dashboard-tab ${filter === f ? 'active' : ''}`}
                  style={{ borderBottomWidth: '0', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        }
      >
        {loading ? (
          // Loading skeleton
          <div className="dashboard-stack">
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className="animate-shimmer" style={{ width: '25%', height: '1rem', borderRadius: 'var(--radius-sm)' }} />
                <div className="animate-shimmer" style={{ width: '16.666%', height: '1rem', borderRadius: 'var(--radius-sm)' }} />
                <div className="animate-shimmer" style={{ width: '16.666%', height: '1rem', borderRadius: 'var(--radius-sm)', marginLeft: 'auto' }} />
                <div className="animate-shimmer" style={{ width: '80px', height: '1.5rem', borderRadius: '999px' }} />
              </div>
            ))}
          </div>
        ) : filteredExpenses.length === 0 ? (
          // Empty state
          <div className="empty-state" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <h4 className="dashboard-section-title" style={{ marginBottom: '0.5rem' }}>
              {expenses.length === 0 ? 'No Records Yet' : 'No Matching Records'}
            </h4>
            <p className="dashboard-subtitle" style={{ marginBottom: '1.5rem', maxWidth: '28rem' }}>
              {expenses.length === 0 
                ? 'Start tracking your property expenses by adding your first record using the form above.'
                : 'No records match your current filters. Try adjusting your search or filter criteria.'}
            </p>
            {expenses.length === 0 && (
              <Button 
                variant="primary" 
                size="sm"
                icon={Plus}
                onClick={() => {
                  setShowForm(true);
                  document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Add Your First Record
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Category</th>
                    <th scope="col" style={{ textAlign: 'right' }}>Amount</th>
                    <th scope="col">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense._id || expense.id}>
                      <td>
                        <div>
                          <p style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                            {expense.title}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            ID: #{expense._id?.slice(-6) || expense.id?.slice(-6) || 'N/A'}
                          </p>
                        </div>
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                          <span>{getCategoryEmoji(expense.category)}</span>
                          <span className="text-capitalize">{expense.category}</span>
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          KES {expense.amount?.toLocaleString() || 0}
                        </span>
                      </td>
                      <td>
                        <Badge variant={expense.isLiability ? 'warning' : 'success'}>
                          {expense.isLiability ? '⚠️ Liability' : '✅ Expense'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', paddingTop: '1rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Showing {filteredExpenses.length} of {expenses.length} records
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  Total: <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    KES {filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0).toLocaleString()}
                  </span>
                </span>
                {filter !== 'all' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setFilter('all')}
                    style={{ fontSize: '0.75rem' }}
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ExpensesTab;
