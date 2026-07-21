const DashboardTabs = ({ activeTab, onChange, tabs }) => (
  <div className="dashboard-tabs">
    {tabs.map((tab) => (
      <button
        key={tab.key}
        onClick={() => onChange(tab.key)}
        className={`dashboard-tab ${activeTab === tab.key ? "active" : ""}`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default DashboardTabs;
