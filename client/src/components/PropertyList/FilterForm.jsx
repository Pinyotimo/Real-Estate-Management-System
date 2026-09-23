import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  MapPin,
  Home,
  Banknote,
  BedDouble,
  Building,
  ChevronDown,
  X,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  KENYA_REGIONS,
  getCountiesForRegion,
  getEstatesForCounty,
} from "../../data/kenyaLocations";
import {
  LISTING_TYPES,
  PROPERTY_CATEGORIES,
  getHouseTypesForCategory,
} from "../../data/propertyTypes";

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-8 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer text-foreground";

const FilterForm = ({ filters, onInputChange, onSearch, onReset }) => {
  const [region, setRegion] = useState("");
  const [estateMode, setEstateMode] = useState("select"); // "select" or "custom"
  const [isExpanded, setIsExpanded] = useState(true);

  // Cascading location options
  const counties = useMemo(() => getCountiesForRegion(region), [region]);
  const estates = useMemo(
    () => getEstatesForCounty(filters.county),
    [filters.county]
  );
  const houseTypeOptions = useMemo(
    () =>
      filters.propertyCategory === "all"
        ? []
        : getHouseTypesForCategory(filters.propertyCategory),
    [filters.propertyCategory]
  );

  // Calculate active filter count badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.keyword?.trim()) count++;
    if (filters.listingType && filters.listingType !== "all") count++;
    if (region) count++;
    if (filters.county) count++;
    if (filters.estate?.trim()) count++;
    if (filters.propertyCategory && filters.propertyCategory !== "all") count++;
    if (filters.houseType && filters.houseType !== "all") count++;
    if (filters.bedrooms && filters.bedrooms !== "all") count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    return count;
  }, [filters, region]);

  const emitChange = (name, value) => {
    onInputChange({ target: { name, value } });
  };

  const handleRegionChange = (e) => {
    const newRegion = e.target.value;
    setRegion(newRegion);
    emitChange("county", "");
    emitChange("estate", "");
    setEstateMode("select");
  };

  const handleCountyChange = (e) => {
    emitChange("county", e.target.value);
    emitChange("estate", "");
    setEstateMode("select");
  };

  const handleEstateSelectChange = (e) => {
    if (e.target.value === "__other__") {
      setEstateMode("custom");
      emitChange("estate", "");
    } else {
      emitChange("estate", e.target.value);
    }
  };

  const handleCategoryChange = (e) => {
    emitChange("propertyCategory", e.target.value);
    emitChange("houseType", "all");
  };

  const handleReset = () => {
    setRegion("");
    setEstateMode("select");
    onReset();
  };

  return (
    <Card className="p-5 sm:p-6 mb-8 border-border bg-card shadow-xs transition-all rounded-2xl">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Find Your Ideal Property
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Filter by location, property type, layout, and budget.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="px-2.5 py-1 text-xs">
              {activeFiltersCount} Active Filter
              {activeFiltersCount > 1 ? "s" : ""}
            </Badge>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{isExpanded ? "Hide Filters" : "Show Filters"}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>
      </div>

      {/* Expandable Filter Grid */}
      {isExpanded && (
        <form
          onSubmit={onSearch}
          className="mt-5 space-y-5 animate-in fade-in duration-200"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Keyword Search */}
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Keyword
              </Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  name="keyword"
                  placeholder="Estate, title, description..."
                  value={filters.keyword}
                  onChange={onInputChange}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Listing Type */}
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Listing Type
              </Label>
              <div className="relative">
                <Home className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <select
                  name="listingType"
                  value={filters.listingType}
                  onChange={onInputChange}
                  className={selectClassName}
                >
                  <option value="all">For Rent & For Sale</option>
                  {LISTING_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Region */}
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Region
              </Label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <select
                  value={region}
                  onChange={handleRegionChange}
                  className={selectClassName}
                >
                  <option value="">All Regions</option>
                  {KENYA_REGIONS.map((r) => (
                    <option key={r.name} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* County */}
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                County
              </Label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <select
                  name="county"
                  value={filters.county}
                  onChange={handleCountyChange}
                  disabled={!region}
                  className={selectClassName}
                >
                  <option value="">
                    {region ? "All Counties" : "Select a region first"}
                  </option>
                  {counties.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Estate */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                  Estate / Locality
                </Label>
                {estateMode === "custom" && (
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => {
                      setEstateMode("select");
                      emitChange("estate", "");
                    }}
                    className="h-auto p-0 text-[11px] text-primary hover:underline flex items-center gap-0.5"
                  >
                    <X className="w-3 h-3" /> Select from list
                  </Button>
                )}
              </div>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                {estateMode === "select" && estates.length > 0 ? (
                  <>
                    <select
                      value={filters.estate || ""}
                      onChange={handleEstateSelectChange}
                      disabled={!filters.county}
                      className={selectClassName}
                    >
                      <option value="">
                        {filters.county
                          ? "All Estates"
                          : "Select a county first"}
                      </option>
                      {estates.map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                      <option value="__other__">Other (type manually)…</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </>
                ) : (
                  <Input
                    type="text"
                    name="estate"
                    placeholder={
                      filters.county
                        ? "e.g. Westlands, Kilimani..."
                        : "Select a county first"
                    }
                    value={filters.estate || ""}
                    onChange={onInputChange}
                    disabled={!filters.county}
                    className="pl-9"
                  />
                )}
              </div>
            </div>

            {/* Property Category */}
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Property Category
              </Label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <select
                  name="propertyCategory"
                  value={filters.propertyCategory}
                  onChange={handleCategoryChange}
                  className={selectClassName}
                >
                  <option value="all">All Categories</option>
                  {Object.keys(PROPERTY_CATEGORIES).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* House Type */}
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                House Type
              </Label>
              <div className="relative">
                <Home className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <select
                  name="houseType"
                  value={filters.houseType}
                  onChange={onInputChange}
                  disabled={filters.propertyCategory === "all"}
                  className={selectClassName}
                >
                  <option value="all">
                    {filters.propertyCategory === "all"
                      ? "Select a category first"
                      : "All House Types"}
                  </option>
                  {houseTypeOptions.map((ht) => (
                    <option key={ht} value={ht}>
                      {ht}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Bedrooms
              </Label>
              <div className="relative">
                <BedDouble className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <select
                  name="bedrooms"
                  value={filters.bedrooms}
                  onChange={onInputChange}
                  className={selectClassName}
                >
                  <option value="all">Any Bedrooms</option>
                  <option value="1">1+ Bedrooms</option>
                  <option value="2">2+ Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Min Price */}
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Min Price (KES)
              </Label>
              <div className="relative">
                <Banknote className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type="number"
                  name="minPrice"
                  placeholder="e.g. 15,000"
                  value={filters.minPrice}
                  onChange={onInputChange}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Max Price */}
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Max Price (KES)
              </Label>
              <div className="relative">
                <Banknote className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type="number"
                  name="maxPrice"
                  placeholder="e.g. 150,000"
                  value={filters.maxPrice}
                  onChange={onInputChange}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Filters
            </Button>

            <Button type="submit" className="gap-2">
              <Search className="w-4 h-4" />
              Search Properties
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
};

FilterForm.propTypes = {
  filters: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default FilterForm;