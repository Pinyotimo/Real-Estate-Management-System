import SectionIcon from "./SectionIcon";

const SpecsFields = ({ formData, onChange, idPrefix = "" }) => (
  <div className="add-property-section add-property-section--cyan">
    <div className="add-property-section-heading" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <SectionIcon>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </SectionIcon>
      Specs
    </div>
    <div className="dashboard-form-grid">
      <div>
        <label className="dashboard-label" htmlFor={`${idPrefix}bedrooms`}>Bedrooms</label>
        <input id={`${idPrefix}bedrooms`} type="number" name="bedrooms" placeholder="3" onChange={onChange} className="dashboard-input" value={formData.bedrooms} min="0" />
      </div>
      <div>
        <label className="dashboard-label" htmlFor={`${idPrefix}bathrooms`}>Bathrooms</label>
        <input id={`${idPrefix}bathrooms`} type="number" name="bathrooms" placeholder="2" onChange={onChange} className="dashboard-input" value={formData.bathrooms} min="0" />
      </div>
      <div>
        <label className="dashboard-label" htmlFor={`${idPrefix}squareMeters`}>Size (m²)</label>
        <input id={`${idPrefix}squareMeters`} type="number" name="squareMeters" placeholder="200" onChange={onChange} className="dashboard-input" value={formData.squareMeters} min="0" />
      </div>
      <div>
        <label className="dashboard-label" htmlFor={`${idPrefix}condition`}>Condition</label>
        <select id={`${idPrefix}condition`} name="condition" onChange={onChange} value={formData.condition} className="dashboard-select">
          <option value="Brand New">Brand New</option>
          <option value="Excellent">Excellent</option>
          <option value="Renovated">Renovated</option>
          <option value="Good">Good</option>
          <option value="Needs Work">Needs Work</option>
        </select>
      </div>
    </div>
  </div>
);

export default SpecsFields;