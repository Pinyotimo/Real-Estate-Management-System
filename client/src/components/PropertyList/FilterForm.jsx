import PropTypes from "prop-types";

const FilterForm = ({ filters, onInputChange, onSearch, onReset }) => {
  return (
    <div className="dashboard-panel" style={{ marginBottom: "2rem" }}>
      <h2 className="dashboard-section-title">Find Your Ideal Property</h2>
      <form onSubmit={onSearch}>
        <div className="dashboard-form-grid">
          <input
            type="text"
            name="keyword"
            placeholder="Search keyword / estate..."
            value={filters.keyword}
            onChange={onInputChange}
            className="dashboard-input"
          />
          <input
            type="text"
            name="county"
            placeholder="County (e.g. Nairobi)"
            value={filters.county}
            onChange={onInputChange}
            className="dashboard-input"
          />
          <select
            name="houseType"
            value={filters.houseType}
            onChange={onInputChange}
            className="dashboard-select"
          >
            <option value="all">All House Types</option>
            <option value="Residential House">Residential House</option>
            <option value="Apartment">Apartment</option>
            <option value="Warehouse">Warehouse</option>
            <option value="Business Space / Office">Business Space / Office</option>
            <option value="Shop / Commercial">Shop / Commercial</option>
          </select>
          <select
            name="bedrooms"
            value={filters.bedrooms}
            onChange={onInputChange}
            className="dashboard-select"
          >
            <option value="all">Any Bedrooms</option>
            <option value="1">1+ Bedrooms</option>
            <option value="2">2+ Bedrooms</option>
            <option value="3">3+ Bedrooms</option>
            <option value="4">4+ Bedrooms</option>
          </select>
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price ($)"
            value={filters.minPrice}
            onChange={onInputChange}
            className="dashboard-input"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price ($)"
            value={filters.maxPrice}
            onChange={onInputChange}
            className="dashboard-input"
          />
        </div>

        <div className="dashboard-inline-actions" style={{ marginTop: "1rem" }}>
          <button type="submit" className="dashboard-btn dashboard-btn--primary">
            Search Properties
          </button>
          <button type="button" onClick={onReset} className="dashboard-btn dashboard-btn--dark">
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