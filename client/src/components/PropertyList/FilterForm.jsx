import PropTypes from "prop-types";

const FilterForm = ({ filters, onInputChange, onSearch, onReset }) => {
  const PRICE_MIN = 0;
  const PRICE_MAX = 10000000000;

  const minPrice = Number(filters.minPrice) || PRICE_MIN;
  const maxPrice = Number(filters.maxPrice) || PRICE_MAX;

  const handleMinSlide = (e) => {
    const value = Math.min(Number(e.target.value), maxPrice - 1000);
    onInputChange({ target: { name: "minPrice", value } });
  };

  const handleMaxSlide = (e) => {
    const value = Math.max(Number(e.target.value), minPrice + 1000);
    onInputChange({ target: { name: "maxPrice", value } });
  };

  const minPercent = ((minPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxPercent = ((maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <>
      <style>{`
        .filter-scroll-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 0.5rem;
          margin: 0 -0.25rem;
        }
        .filter-scroll-wrapper::-webkit-scrollbar {
          height: 6px;
        }
        .filter-scroll-wrapper::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 4px;
        }
        .filter-scroll-track {
          display: flex;
          gap: 1rem;
          min-width: max-content;
          padding: 0 0.25rem;
        }
        .filter-field {
          min-width: 190px;
        }
        .filter-field--wide {
          min-width: 260px;
        }
        .filter-field-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin-bottom: 0.3rem;
        }

        /* ===== Price range slider ===== */
        .price-slider-block {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .price-slider-values {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--primary);
        }
        .price-slider-track {
          position: relative;
          height: 32px;
        }
        .price-slider-rail {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 4px;
          transform: translateY(-50%);
          background: var(--border);
          border-radius: 4px;
        }
        .price-slider-fill {
          position: absolute;
          top: 50%;
          height: 4px;
          transform: translateY(-50%);
          background: var(--primary);
          border-radius: 4px;
        }
        .price-slider-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          margin: 0;
          background: transparent;
          -webkit-appearance: none;
          appearance: none;
          pointer-events: none;
        }
        .price-slider-input::-webkit-slider-thumb {
          pointer-events: auto;
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--primary);
          border: 2px solid var(--surface);
          box-shadow: var(--shadow-sm);
          cursor: pointer;
          margin-top: 7px;
        }
        .price-slider-input::-moz-range-thumb {
          pointer-events: auto;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--primary);
          border: 2px solid var(--surface);
          box-shadow: var(--shadow-sm);
          cursor: pointer;
        }
        .price-slider-input::-webkit-slider-runnable-track {
          background: transparent;
        }

        .filter-actions-row {
          display: flex;
          gap: 0.5rem;
          margin-top: 1.25rem;
          flex-wrap: wrap;
        }
      `}</style>

      <div className="dashboard-panel" style={{ marginBottom: "2rem" }}>
        <h2 className="dashboard-section-title">Find Your Ideal Property</h2>
        <form onSubmit={onSearch}>
          <div className="filter-scroll-wrapper">
            <div className="filter-scroll-track">
              <div className="filter-field filter-field--wide">
                <label className="filter-field-label">Keyword</label>
                <input
                  type="text"
                  name="keyword"
                  placeholder="Search keyword / estate..."
                  value={filters.keyword}
                  onChange={onInputChange}
                  className="dashboard-input"
                />
              </div>

              <div className="filter-field">
                <label className="filter-field-label">County</label>
                <input
                  type="text"
                  name="county"
                  placeholder="e.g. Nairobi"
                  value={filters.county}
                  onChange={onInputChange}
                  className="dashboard-input"
                />
              </div>

              <div className="filter-field">
                <label className="filter-field-label">House Type</label>
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
                  <option value="Business Space / Office">
                    Business Space / Office
                  </option>
                  <option value="Shop / Commercial">Shop / Commercial</option>
                </select>
              </div>

              <div className="filter-field">
                <label className="filter-field-label">Bedrooms</label>
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
              </div>

              <div className="filter-field filter-field--wide">
                <label className="filter-field-label">Price Range</label>
                <div className="price-slider-block">
                  <div className="price-slider-values">
                    <span>Ksh {minPrice.toLocaleString()}</span>
                    <span>Ksh {maxPrice.toLocaleString()}</span>
                  </div>
                  <div className="price-slider-track">
                    <div className="price-slider-rail" />
                    <div
                      className="price-slider-fill"
                      style={{
                        left: `${minPercent}%`,
                        width: `${maxPercent - minPercent}%`,
                      }}
                    />
                    <input
                      type="range"
                      className="price-slider-input"
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      step={1000000}
                      value={minPrice}
                      onChange={handleMinSlide}
                    />
                    <input
                      type="range"
                      className="price-slider-input"
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      step={1000000}
                      value={maxPrice}
                      onChange={handleMaxSlide}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="filter-actions-row">
            <button type="submit" className="dashboard-btn">
              Search Properties
            </button>
            <button
              type="button"
              onClick={onReset}
              className="dashboard-btn dashboard-btn--dark"
            >
              Reset Filters
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

FilterForm.propTypes = {
  filters: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default FilterForm;
