import PropTypes from "prop-types";

const FilterForm = ({ filters, onInputChange, onSearch, onReset }) => {
  return (
    <div className="dashboard-panel">
      <div className="dashboard-space-between">
        <div>
          <h2 className="dashboard-section-title">Find Your Ideal Property</h2>
          <p className="dashboard-subtitle">Filter by location, type, size, and budget.</p>
        </div>
        <button type="button" className="dashboard-btn dashboard-btn--ghost">Filters</button>
      </div>
      <form onSubmit={onSearch}>
        <div className="dashboard-form-grid">
          <label>
            <span className="dashboard-label">Keyword</span>
            <input type="text" name="keyword" placeholder="Estate, title, description" value={filters.keyword} onChange={onInputChange} className="dashboard-input" />
          </label>
          <label>
            <span className="dashboard-label">County</span>
            <input type="text" name="county" placeholder="Nairobi" value={filters.county} onChange={onInputChange} className="dashboard-input" />
          </label>
          <label>
            <span className="dashboard-label">Property Type</span>
            <select name="houseType" value={filters.houseType} onChange={onInputChange} className="dashboard-select">
              <option value="all">All House Types</option>
              <option value="Residential House">Residential House</option>
              <option value="Apartment">Apartment</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Business Space / Office">Business Space / Office</option>
              <option value="Shop / Commercial">Shop / Commercial</option>
            </select>
          </label>
          <label>
            <span className="dashboard-label">Bedrooms</span>
            <select name="bedrooms" value={filters.bedrooms} onChange={onInputChange} className="dashboard-select">
              <option value="all">Any Bedrooms</option>
              <option value="1">1+ Bedrooms</option>
              <option value="2">2+ Bedrooms</option>
              <option value="3">3+ Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>
          </label>
          <label>
            <span className="dashboard-label">Min Price</span>
            <input type="number" name="minPrice" placeholder="$0" value={filters.minPrice} onChange={onInputChange} className="dashboard-input" />
          </label>
          <label>
            <span className="dashboard-label">Max Price</span>
            <input type="number" name="maxPrice" placeholder="$10,000" value={filters.maxPrice} onChange={onInputChange} className="dashboard-input" />
          </label>
        </div>

        <div className="dashboard-inline-actions">
          <button type="submit" className="dashboard-btn dashboard-btn--primary">
            Search Properties
          </button>
          <button type="button" onClick={onReset} className="dashboard-btn dashboard-btn--outline">
            Reset Filters
          </button>
        </div>
      </form>
    </div>
  );
};

FilterForm.propTypes = {
  filters: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default FilterForm;
