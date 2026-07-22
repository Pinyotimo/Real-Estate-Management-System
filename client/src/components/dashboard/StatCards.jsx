const StatCards = ({ financials }) => {
  const cards = [
    {
      title: "Total Income (Collected Rent)",
      value: financials?.totalIncome ?? 0,
      icon: "💰",
      colorVar: "var(--success)",
      softVar: "var(--success-soft)",
    },
    {
      title: "Tenant Arrears (Pending Rent)",
      value: financials?.totalArrears ?? 0,
      icon: "⚠️",
      colorVar: "var(--danger)",
      softVar: "var(--danger-soft)",
    },
    {
      title: "Total Expenses Paid",
      value: financials?.totalExpenses ?? 0,
      icon: "🧾",
      colorVar: "var(--primary)",
      softVar: "var(--primary-soft)",
    },
    {
      title: "Outstanding Liabilities",
      value: financials?.totalLiabilities ?? 0,
      icon: "📌",
      colorVar: "var(--warning)",
      softVar: "var(--warning-soft)",
    },
  ];

  return (
    <>
      <style>{`
        .stat-card {
          position: relative;
          padding: 1.5rem 1.25rem 1.25rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .stat-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
        .stat-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--stat-color);
        }
        .stat-card-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          border-radius: 10px;
          background: var(--stat-soft);
          margin-bottom: 0.75rem;
        }
        .stat-card-title {
          display: block;
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .stat-card-value {
          display: block;
          font-size: 1.6rem;
          font-weight: 700;
          margin-top: 0.25rem;
        }
        .stat-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
      `}</style>

      <div className="stat-card-grid">
        {cards.map((card) => (
          <div
            key={card.title}
            className="stat-card"
            style={{
              "--stat-color": card.colorVar,
              "--stat-soft": card.softVar,
            }}
          >
            <div className="stat-card-icon">{card.icon}</div>
            <span className="stat-card-title">{card.title}</span>
            <span className="stat-card-value" style={{ color: card.colorVar }}>
              Ksh {Number(card.value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default StatCards;
