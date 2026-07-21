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
      <FilterForm
        filters={filters}
        onInputChange={handleInputChange}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {loading ? (
        <p style={{ textAlign: "center", marginTop: "2rem", color: "var(--text-muted)" }}>
          Searching properties...
        </p>
      ) : properties.length === 0 ? (
        <div style={{ textAlign: "center", margin: "3rem 0", color: "var(--text-muted)" }}>
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