const SectionIcon = ({ children }) => (
  <span
    style={{
      width: "28px",
      height: "28px",
      borderRadius: "var(--radius-sm)",
      background: "var(--brand-very-light-blue)",
      color: "var(--brand-blue)",
      display: "inline-grid",
      placeItems: "center",
      flexShrink: 0,
    }}
  >
    {children}
  </span>
);

export default SectionIcon;