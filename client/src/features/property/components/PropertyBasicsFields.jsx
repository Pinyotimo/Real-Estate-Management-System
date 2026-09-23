import SectionIcon from "./SectionIcon";

const PropertyBasicsFields = ({ formData, onChange, idPrefix = "" }) => (
  <div className="add-property-section">
    <div className="add-property-section-heading" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <SectionIcon>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </SectionIcon>
      Basics
    </div>
    <div className="dashboard-form-stack">
      <div>
        <label className="dashboard-label required" htmlFor={`${idPrefix}title`}>Property Title</label>
        <input
          id={`${idPrefix}title`}
          type="text"
          name="title"
          placeholder="e.g. Modern 4-Bed Villa in Kilimani"
          onChange={onChange}
          required
          className="dashboard-input"
          value={formData.title}
        />
      </div>
      <div>
        <label className="dashboard-label required" htmlFor={`${idPrefix}description`}>Full Description</label>
        <textarea
          id={`${idPrefix}description`}
          name="description"
          placeholder="Describe the property, amenities, and neighborhood..."
          onChange={onChange}
          required
          className="dashboard-input"
          rows="5"
          value={formData.description}
          maxLength={1200}
          style={{ resize: "vertical", minHeight: "100px" }}
        />
        <div style={{ textAlign: "right", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
          {formData.description.length} / 1200
        </div>
      </div>
    </div>
  </div>
);

export default PropertyBasicsFields;