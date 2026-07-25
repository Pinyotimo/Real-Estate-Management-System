import { useEffect, useState } from "react";
import API from "../../api";
import FilterForm from "./FilterForm";
import PropertyCard from "./PropertyCard";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    keyword: "",
    houseType: "all",
    county: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "all",
  });

  const fetchProperties = async (searchParams = {}) => {
    setLoading(true);
    try {
      const { data } = await API.get("/properties", { params: searchParams });
      setProperties(data.data);
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties(filters);
  };

  const handleReset = () => {
    const resetState = {
      keyword: "",
      houseType: "all",
      county: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "all",
    };
    setFilters(resetState);
    fetchProperties(resetState);
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard-space-between">
        <div>
          <h1 className="dashboard-title">Property Portfolio</h1>
          <p className="dashboard-subtitle">
            Search, compare, and open detailed property records.
          </p>
        </div>
        <button type="button" className="dashboard-btn dashboard-btn--outline">
          Export
        </button>
      </div>
      <FilterForm
        filters={filters}
        onInputChange={handleInputChange}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {loading ? (
        <div className="dashboard-card-grid dashboard-card-grid--property">
          <div className="dashboard-card animate-shimmer" />
          <div className="dashboard-card animate-shimmer" />
          <div className="dashboard-card animate-shimmer" />
        </div>
      ) : properties.length === 0 ? (
        <div className="empty-state">
          <h3>No properties match your filter criteria.</h3>
          <p>Try resetting filters or adjusting your search parameters.</p>
        </div>
      ) : (
        <div className="dashboard-card-grid dashboard-card-grid--property">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyList;
