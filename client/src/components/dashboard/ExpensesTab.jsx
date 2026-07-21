const ExpensesTab = ({
  expenses,
  expenseForm,
  onExpenseFormChange,
  onSubmitExpense,
}) => (
  <div>
    <h3 className="dashboard-section-title">Record Expense or Liability</h3>
    <form onSubmit={onSubmitExpense} className="dashboard-form-row">
      <input
        type="text"
        placeholder="Title (e.g. WiFi Bill / Repairs)"
        value={expenseForm.title}
        onChange={(event) => onExpenseFormChange("title", event.target.value)}
        required
        className="dashboard-input"
      />
      <input
        type="number"
        placeholder="Amount ($)"
        value={expenseForm.amount}
        onChange={(event) => onExpenseFormChange("amount", event.target.value)}
        required
        className="dashboard-input"
      />
      <select
        value={expenseForm.category}
        onChange={(event) =>
          onExpenseFormChange("category", event.target.value)
        }
        className="dashboard-input"
      >
        <option value="repairs">Repairs</option>
        <option value="utilities">Utilities</option>
        <option value="taxes">Taxes</option>
        <option value="maintenance">Maintenance</option>
      </select>
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
      <button type="submit" className="dashboard-btn dashboard-btn--success">
        + Add Record
      </button>
    </form>

    <h3 className="dashboard-section-title">Logged Expenses & Liabilities</h3>
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
        {expenses.map((expense) => (
          <tr key={expense._id}>
            <td>{expense.title}</td>
            <td>{expense.category}</td>
            <td>${expense.amount}</td>
            <td>
              <span
                className={`dashboard-pill ${expense.isLiability ? "dashboard-pill--warning" : "dashboard-pill--success"}`}
              >
                {expense.isLiability ? "Liability (Unpaid)" : "Expense (Paid)"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ExpensesTab;
