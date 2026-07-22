const StatCards = ({ financials }) => {
  const cards = [
    {
      title: "Total Income (Collected Rent)",
      value: financials?.totalIncome ?? 0,
      color: "#16a34a",
    },
    {
      title: "Tenant Arrears (Pending Rent)",
      value: financials?.totalArrears ?? 0,
      color: "#dc2626",
    },
    {
      title: "Total Expenses Paid",
      value: financials?.totalExpenses ?? 0,
      color: "#2563eb",
    },
    {
      title: "Outstanding Liabilities",
      value: financials?.totalLiabilities ?? 0,
      color: "#d97706",
    },
  ];

  return (
    <div className="dashboard-card-grid">
      {cards.map((card) => (
        <div key={card.title} className="dashboard-card">
          <span className="dashboard-card-title">{card.title}</span>
          <span className="dashboard-card-value" style={{ color: card.color }}>
            ${Number(card.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
