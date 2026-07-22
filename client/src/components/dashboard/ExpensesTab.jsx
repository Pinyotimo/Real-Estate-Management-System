const CATEGORY_META = {
  repairs: { icon: "🔧", label: "Repairs" },
  utilities: { icon: "💡", label: "Utilities" },
  taxes: { icon: "📋", label: "Taxes" },
  maintenance: { icon: "🧹", label: "Maintenance" },
};

const ExpensesTab = ({
  expenses,
  expenseForm,
  onExpenseFormChange,
  onSubmitExpense,
}) => (
  <>
    <style>{`
      .expense-form-card {
        background: var(--surface-soft);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 1.25rem;
        margin-bottom: 2rem;
      }
      .expense-form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 1rem;
        align-items: end;
      }
      .expense-form-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-light);
      }
      .expense-category-cell {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
      }
      .expense-empty-state {
        text-align: center;
        padding: 2rem 1rem;
        color: var(--text-muted);
        background: var(--surface-soft);
        border: 1px dashed var(--border);
        border-radius: var(--radius);
      }
    `}</style>

    <div>
      <h3 className="dashboard-section-title">Record Expense or Liability</h3>
      <form onSubmit={onSubmitExpense} className="expense-form-card">
        <div className="expense-form-grid">
          <div>
            <label className="dashboard-label">Title</label>
            <input
              type="text"
              placeholder="e.g. WiFi Bill / Repairs"
              value={expenseForm.title}
              onChange={(event) =>
                onExpenseFormChange("title", event.target.value)
              }
              required
              className="dashboard-input"
            />
          </div>
          <div>
            <label className="dashboard-label">Amount (Ksh)</label>
            <input
              type="number"
              placeholder="0.00"
              value={expenseForm.amount}
              onChange={(event) =>
                onExpenseFormChange("amount", event.target.value)
              }
              required
              className="dashboard-input"
            />
          </div>
          <div>
            <label className="dashboard-label">Category</label>
            <select
              value={expenseForm.category}
              onChange={(event) =>
                onExpenseFormChange("category", event.target.value)
              }
              className="dashboard-input"
            >
              {Object.entries(CATEGORY_META).map(([value, meta]) => (
                <option key={value} value={value}>
                  {meta.icon} {meta.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="expense-form-actions">
          <label className="dashboard-checkbox-label">
            <input
              type="checkbox"
              checked={expenseForm.isLiability}
              onChange={(event) =>
                onExpenseFormChange("isLiability", event.target.checked)
              }
            />
            Is Unpaid Liability?
          </label>
          <button
            type="submit"
            className="dashboard-btn dashboard-btn--success"
          >
            + Add Record
          </button>
        </div>
      </form>

      <h3 className="dashboard-section-title">Logged Expenses & Liabilities</h3>
      {expenses.length === 0 ? (
        <div className="expense-empty-state">
          No expenses or liabilities logged yet.
        </div>
      ) : (
        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => {
                const meta = CATEGORY_META[expense.category] ?? {
                  icon: "📄",
                  label: expense.category,
                };
                return (
                  <tr key={expense._id}>
                    <td>{expense.title}</td>
                    <td>
                      <span className="expense-category-cell">
                        {meta.icon} {meta.label}
                      </span>
                    </td>
                    <td>Ksh {Number(expense.amount).toLocaleString()}</td>
                    <td>
                      <span
                        className={`dashboard-pill ${
                          expense.isLiability
                            ? "dashboard-pill--warning"
                            : "dashboard-pill--success"
                        }`}
                      >
                        {expense.isLiability
                          ? "Liability (Unpaid)"
                          : "Expense (Paid)"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </>
);

export default ExpensesTab;
