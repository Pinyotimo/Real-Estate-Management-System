const sizeStyles = {
  sm: { padding: "0.5rem 0.75rem", fontSize: "0.75rem", minHeight: "32px" },
  md: { padding: "0.7rem 0.9rem", fontSize: "0.85rem", minHeight: "40px" },
  lg: { padding: "0.85rem 1.25rem", fontSize: "0.95rem", minHeight: "48px" },
};

const DashboardTabs = ({
  activeTab,
  onChange,
  tabs,
  size = "md",
  fullWidth = false,
  centered = false,
}) => {
  return (
    <div
      role="tablist"
      className="dashboard-tabs"
      style={{
        justifyContent: centered ? "center" : undefined,
        width: fullWidth ? "100%" : undefined,
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const Icon = tab.icon;
        const iconSize = size === "sm" ? 14 : size === "lg" ? 20 : 16;
        const badgeValue = tab.badge !== undefined ? tab.badge : tab.count;

        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            aria-controls={tab.panelId || `tab-panel-${tab.key}`}
            id={tab.tabId || `tab-${tab.key}`}
            onClick={() => onChange(tab.key)}
            className={`dashboard-tab${isActive ? " active" : ""}`}
            disabled={tab.disabled}
            title={tab.title || tab.label}
            style={{
              ...sizeStyles[size],
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flex: fullWidth ? 1 : undefined,
              justifyContent: fullWidth ? "center" : undefined,
              opacity: tab.disabled ? 0.5 : 1,
              cursor: tab.disabled ? "not-allowed" : "pointer",
              pointerEvents: tab.disabled ? "none" : undefined,
            }}
          >
            {Icon && <Icon size={iconSize} style={{ flexShrink: 0 }} />}
            <span>{tab.label}</span>

            {badgeValue !== undefined && badgeValue > 0 && (
              <span
                className="dashboard-pill"
                style={{
                  marginLeft: "0.25rem",
                  padding: "0.1rem 0.5rem",
                  fontSize: "0.7rem",
                  background: isActive ? "var(--brand-very-light-blue)" : "var(--surface-muted)",
                  color: isActive ? "var(--brand-blue)" : "var(--text-muted)",
                }}
              >
                {badgeValue > 99 ? "99+" : badgeValue}
              </span>
            )}

            {tab.dot && (
              <span
                style={{
                  marginLeft: "0.25rem",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--brand-blue)",
                  display: "inline-block",
                }}
                aria-label="Has updates"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default DashboardTabs;