import SectionIcon from "./SectionIcon";
import { KENYA_REGIONS } from "../../../data/kenyaLocations";

const LocationFields = ({ location, idPrefix = "" }) => {
  const {
    region, county, estate, estateMode, counties, estates,
    handleRegionChange, handleCountyChange, handleEstateSelectChange, handleEstateInputChange,
  } = location;

  return (
    <div className="add-property-section">
      <div className="add-property-section-heading" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <SectionIcon>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </SectionIcon>
        Location
      </div>
      <div className="dashboard-form-grid">
        <div>
          <label className="dashboard-label required" htmlFor={`${idPrefix}region`}>Region</label>
          <select id={`${idPrefix}region`} value={region} onChange={handleRegionChange} className="dashboard-select">
            <option value="">Select a region</option>
            {KENYA_REGIONS.map((r) => (
              <option key={r.name} value={r.name}>{r.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="dashboard-label required" htmlFor={`${idPrefix}county`}>County</label>
          <select
            id={`${idPrefix}county`}
            value={county}
            onChange={handleCountyChange}
            className="dashboard-select"
            disabled={!region}
            required
          >
            <option value="">{region ? "Select a county" : "Select a region first"}</option>
            {counties.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="dashboard-label required" htmlFor={`${idPrefix}estate`}>Estate / Area</label>
          {estateMode === "select" && estates.length > 0 ? (
            <select
              id={`${idPrefix}estate`}
              value={estate}
              onChange={handleEstateSelectChange}
              className="dashboard-select"
              disabled={!county}
              required
            >
              <option value="">{county ? "Select an estate" : "Select a county first"}</option>
              {estates.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
              <option value="__other__">Other (type manually)…</option>
            </select>
          ) : (
            <input
              id={`${idPrefix}estate`}
              type="text"
              placeholder={county ? "e.g. Dagoretti" : "Select a county first"}
              onChange={handleEstateInputChange}
              required
              className="dashboard-input"
              value={estate}
              disabled={!county}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationFields;