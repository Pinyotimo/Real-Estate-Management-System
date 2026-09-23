import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Building2,
  Download,
  SearchX,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import API from "../../api";
import FilterForm from "./FilterForm";
import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const INITIAL_FILTERS = {
  keyword: "",
  houseType: "all",
  propertyCategory: "all",
  listingType: "all",
  county: "",
  estate: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "all",
};

const sanitizeParams = (paramsObj) => {
  const cleaned = {};
  Object.entries(paramsObj).forEach(([key, val]) => {
    if (val !== "" && val !== "all" && val !== null && val !== undefined) {
      cleaned[key] = val;
    }
  });
  return cleaned;
};

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const fetchProperties = useCallback(async (searchFilters) => {
    setLoading(true);
    try {
      const cleanParams = sanitizeParams(searchFilters);
      const { data } = await API.get("/properties", { params: cleanParams });
      setProperties(data.data || []);
    } catch (err) {
      console.error("Error fetching properties:", err);
      toast.error("Failed to load properties. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties(filters);
  }, []);

  const handleInputChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties(filters);
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
    fetchProperties(INITIAL_FILTERS);
    toast.info("Search filters reset.");
  };

  const handleExportCSV = () => {
    if (!properties.length) {
      toast.error("No property data available to export.");
      return;
    }

    const headers = [
      "Title",
      "Category",
      "Listing Type",
      "County",
      "Estate",
      "Price (KES)",
      "Bedrooms",
      "Status",
    ];

    const rows = properties.map((p) => [
      `"${p.title || ""}"`,
      `"${p.propertyCategory || p.category || ""}"`,
      `"${p.listingType || ""}"`,
      `"${p.county || ""}"`,
      `"${p.estate || ""}"`,
      p.price || 0,
      p.bedrooms || 0,
      `"${p.status || "vacant"}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `properties_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Property list exported to CSV!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2.5 tracking-tight">
            <Building2 className="w-7 h-7 text-primary" />
            Property Portfolio
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Search, compare, and view detailed listing records across all regions.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleExportCSV}
          disabled={loading || properties.length === 0}
          className="gap-2 rounded-xl h-10 self-start sm:self-auto shadow-xs"
        >
          <Download className="w-4 h-4 text-muted-foreground" />
          Export CSV
        </Button>
      </div>

      {/* Filter Form Component */}
      <FilterForm
        filters={filters}
        onInputChange={handleInputChange}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* Results Meta Bar */}
      {!loading && (
        <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
          <p>
            Showing <span className="font-bold text-foreground">{properties.length}</span>{" "}
            {properties.length === 1 ? "property listing" : "property listings"}
          </p>
          {properties.length > 0 && (
            <Badge variant="secondary" className="gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
              <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Live Market Data
            </Badge>
          )}
        </div>
      )}

      {/* Main Grid View */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="rounded-2xl p-4 space-y-4 border border-border bg-card">
              <Skeleton className="w-full h-48 rounded-xl" />
              <Skeleton className="h-5 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/2 rounded" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-6 w-1/3 rounded" />
                <Skeleton className="h-9 w-24 rounded-xl" />
              </div>
            </Card>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-8"
        >
          <Card className="p-10 text-center space-y-4 max-w-lg mx-auto border-border bg-card">
            <div className="w-16 h-16 bg-muted text-muted-foreground rounded-2xl flex items-center justify-center mx-auto">
              <SearchX className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                No matching properties found
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                We couldn’t find any properties matching your search criteria. Try adjusting your filters.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={handleReset}
              className="gap-2 rounded-xl text-primary bg-primary/10 hover:bg-primary/20"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All Filters
            </Button>
          </Card>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {properties.map((property, idx) => (
              <motion.div
                key={property._id || property.id || idx}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default PropertyList;