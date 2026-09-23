import SectionIcon from "./SectionIcon";
import { LISTING_TYPES, PROPERTY_CATEGORIES } from "../../../data/propertyTypes";

const ListingDetailsFields = ({
  formData,
  onChange,
  onCategoryChange,
  houseTypeOptions,
  showStatus = false,
  idPrefix = "",
}) => (
  <div className="add-property-section add-property-section--navy">
    <div className="add-property-section-heading" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <SectionIcon>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </SectionIcon>
      Listing Type, Category & Price
    </div>
    <div className="dashboard-form-grid">
      <div>
        <label className="dashboard-label required" htmlFor={`${idPrefix}listingType`}>Listing Type</label>
        <select
          id={`${idPrefix}listingType`}
          name="listingType"
          onChange={onChange}
          value={formData.listingType}
          className="dashboard-select"
        >
          {LISTING_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="dashboard-label required" htmlFor={`${idPrefix}propertyCategory`}>Property Category</label>
        <select
          id={`${idPrefix}propertyCategory`}
          name="propertyCategory"
          onChange={onCategoryChange}
          value={formData.propertyCategory}
          className="dashboard-select"
        >
          {Object.keys(PROPERTY_CATEGORIES).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="dashboard-label required" htmlFor={`${idPrefix}houseType`}>House Type</label>
        <select
          id={`${idPrefix}houseType`}
          name="houseType"
          onChange={onChange}
          value={formData.houseType}
          className="dashboard-select"
        >
          {houseTypeOptions.map((ht) => (
            <option key={ht} value={ht}>{ht}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="dashboard-label required" htmlFor={`${idPrefix}price`}>
          Price (KES) {formData.listingType === "For Rent" && <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>/ month</span>}
        </label>
        <input
          id={`${idPrefix}price`}
          type="number"
          name="price"
          placeholder="e.g. 450000"
          onChange={onChange}
          required
          className="dashboard-input"
          value={formData.price}
          min="0"
        />
      </div>
      {showStatus && (
        <div>
          <label className="dashboard-label required" htmlFor={`${idPrefix}status`}>Status</label>
          <select
            id={`${idPrefix}status`}
            name="status"
            value={formData.status}
            onChange={onChange}
            className="dashboard-select"
            required
          >
            <option value="vacant">Vacant</option>
            <option value="occupied">Occupied</option>
          </select>
        </div>
      )}
    </div>
  </div>
);

export default ListingDetailsFields;