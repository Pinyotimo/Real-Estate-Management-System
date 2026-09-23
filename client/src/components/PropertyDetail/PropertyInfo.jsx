import React from "react";
import PropTypes from "prop-types";
import {
  Home,
  BedDouble,
  Bath,
  Sparkles,
  Ruler,
  MapPin,
  FileText,
  CheckCircle2,
  Layers,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PropertyInfo = ({ property = {} }) => {
  const {
    title,
    price,
    estate,
    county,
    listingType,
    propertyCategory,
    houseType,
    bedrooms,
    bathrooms,
    condition,
    squareMeters,
    description,
    mapLocation,
    amenities,
  } = property;

  const amenityList = Array.isArray(amenities) ? amenities : [];
  const isRent = listingType?.toLowerCase() === "for rent";

  return (
    <div className="space-y-6">
      {/* Primary Header Card */}
      <Card className="border-border bg-card rounded-3xl shadow-xs">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              {listingType && (
                <div>
                  <Badge
                    variant="outline"
                    className={`gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wide border ${
                      listingType === "For Sale"
                        ? "bg-destructive/10 text-destructive border-destructive/20"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        listingType === "For Sale"
                          ? "bg-destructive"
                          : "bg-emerald-500"
                      }`}
                    />
                    {listingType}
                  </Badge>
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
                {title || "Untitled Property"}
              </h1>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>
                  {estate ? `${estate}, ` : ""}
                  {county ? `${county} County` : "Location Unspecified"}
                </span>
              </p>
            </div>

            {/* Price Tag */}
            <div className="sm:text-right shrink-0 bg-muted/40 sm:bg-transparent p-3.5 sm:p-0 rounded-2xl border border-border sm:border-0">
              <div className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                KES {Number(price || 0).toLocaleString()}
              </div>
              {isRent && (
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mt-0.5">
                  per month
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Overview Grid */}
      <Card className="border-border bg-card rounded-3xl shadow-xs">
        <CardContent className="p-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Property Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
            {propertyCategory && (
              <div className="flex items-center gap-3 p-3.5 bg-muted/40 rounded-2xl border border-border">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Category
                  </span>
                  <span className="text-sm font-bold text-foreground truncate block">
                    {propertyCategory}
                  </span>
                </div>
              </div>
            )}

            {houseType && (
              <div className="flex items-center gap-3 p-3.5 bg-muted/40 rounded-2xl border border-border">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Home className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Type
                  </span>
                  <span className="text-sm font-bold text-foreground truncate block">
                    {houseType}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3.5 bg-muted/40 rounded-2xl border border-border">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <BedDouble className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Bedrooms
                </span>
                <span className="text-sm font-bold text-foreground block">
                  {bedrooms || 0}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-muted/40 rounded-2xl border border-border">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Bath className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Bathrooms
                </span>
                <span className="text-sm font-bold text-foreground block">
                  {bathrooms || 0}
                </span>
              </div>
            </div>

            {condition && (
              <div className="flex items-center gap-3 p-3.5 bg-muted/40 rounded-2xl border border-border">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Condition
                  </span>
                  <span className="text-sm font-bold text-foreground truncate block">
                    {condition}
                  </span>
                </div>
              </div>
            )}

            {squareMeters > 0 && (
              <div className="flex items-center gap-3 p-3.5 bg-muted/40 rounded-2xl border border-border">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Ruler className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Size
                  </span>
                  <span className="text-sm font-bold text-foreground block">
                    {squareMeters} m²
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Amenities Section */}
      {amenityList.length > 0 && (
        <Card className="border-border bg-card rounded-3xl shadow-xs">
          <CardContent className="p-6">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Amenities & Features</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {amenityList.map((amenity, idx) => (
                <Badge
                  key={`${amenity}-${idx}`}
                  variant="outline"
                  className="gap-2 px-3.5 py-1.5 rounded-xl bg-muted/50 border-border text-xs font-semibold text-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {amenity}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Description Section */}
      <Card className="border-border bg-card rounded-3xl shadow-xs">
        <CardContent className="p-6">
          <h2 className="text-base font-bold text-foreground mb-3">
            Property Description
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {description || "No description available for this property listing."}
          </p>
        </CardContent>
      </Card>

      {/* Map & Location Section */}
      <Card className="border-border bg-card rounded-3xl shadow-xs">
        <CardContent className="p-6">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Location & Neighborhood</span>
          </h2>
          <div className="bg-muted/40 border border-border rounded-2xl p-6 text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {estate ? `${estate}, ` : ""}
                {county ? `${county} County` : "Location Unspecified"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Interactive map preview placeholder
              </p>
            </div>
            {mapLocation && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="gap-2 text-xs font-semibold rounded-xl border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 cursor-pointer shadow-xs"
              >
                <a href={mapLocation} target="_blank" rel="noreferrer">
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents Section */}
      <Card className="border-border bg-card rounded-3xl shadow-xs">
        <CardContent className="p-6">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <span>Documents & Verification</span>
          </h2>
          <div className="bg-muted/40 border border-border rounded-2xl p-6 text-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-muted-foreground mx-auto" />
            <p className="text-xs font-medium text-muted-foreground">
              No property documents or floor plans uploaded yet.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

PropertyInfo.propTypes = {
  property: PropTypes.shape({
    title: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    estate: PropTypes.string,
    county: PropTypes.string,
    listingType: PropTypes.string,
    propertyCategory: PropTypes.string,
    houseType: PropTypes.string,
    bedrooms: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bathrooms: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    condition: PropTypes.string,
    squareMeters: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    mapLocation: PropTypes.string,
    amenities: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default PropertyInfo;