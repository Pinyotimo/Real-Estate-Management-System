import SectionIcon from "./SectionIcon";

const MapLinkFields = ({ formData, onChange, idPrefix = "" }) => (
  <div className="add-property-section add-property-section--navy">
    <div className="add-property-section-heading" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <SectionIcon>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 7m0 13V7" />
        </svg>
      </SectionIcon>
      Map Location
    </div>
    <div>
      <label className="dashboard-label" htmlFor={`${idPrefix}mapLocation`}>Google Maps Link</label>
      <input
        id={`${idPrefix}mapLocation`}
        type="url"
        name="mapLocation"
        placeholder="https://maps.app.goo.gl/..."
        onChange={onChange}
        className="dashboard-input"
        value={formData.mapLocation}
      />
    </div>
  </div>
);

export default MapLinkFields;