import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Bed, Bath, MapPin, Heart, Home, ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFavourites } from "@/context/FavouritesContext";

const PropertyCard = ({ property, onSave, isSaved }) => {
  const { isFavourite, toggleFavourite } = useFavourites();

  const {
    _id,
    id,
    title = "Untitled Property",
    price = 0,
    images = [],
    estate,
    county,
    location,
    houseType,
    bedrooms,
    bathrooms,
    status = "vacant",
  } = property || {};

  const propertyId = _id || id;
  const activeSaved = isSaved !== undefined ? isSaved : isFavourite(propertyId);
  const imageUrl = images && images.length > 0 ? images[0] : null;
  const locationText = estate && county ? `${estate}, ${county}` : location || "Location N/A";
  const isVacant = status?.toLowerCase() === "vacant";

  const formattedPrice = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(price || 0);

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    toggleFavourite(property);

    if (onSave) {
      onSave(property);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="card-surface card-hover card-accent group relative flex h-full flex-col overflow-hidden rounded-2xl">
        {/* Image Frame & Overlays */}
        <div className="card-media relative h-56 w-full sm:h-64 lg:h-60">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/40 bg-secondary/30">
              <Home className="h-12 w-12 stroke-[1.5]" />
            </div>
          )}

          {/* Top Scrim Gradient for Contrast */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 via-black/10 to-transparent pointer-events-none" />

          {/* Status Badge */}
          <span
            className={`card-chip absolute left-3 top-3 z-10 ${
              isVacant
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-amber-700 dark:text-amber-300"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isVacant ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            {isVacant ? "Vacant" : "Occupied"}
          </span>

          {/* Animated Favorite Button */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-3 right-3 z-10"
          >
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-md border border-border/50 hover:bg-background shadow-xs text-foreground cursor-pointer"
              onClick={handleSaveClick}
              aria-label={activeSaved ? "Remove from favourites" : "Save property"}
              title={activeSaved ? "Remove from favourites" : "Save property"}
            >
              <motion.div
                animate={activeSaved ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                transition={{ duration: 0.25 }}
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    activeSaved
                      ? "fill-rose-500 text-rose-500"
                      : "text-muted-foreground hover:text-rose-500"
                  }`}
                />
              </motion.div>
            </Button>
          </motion.div>
        </div>

        {/* Content Body */}
        <div className="flex flex-col flex-1 p-5 justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-semibold text-base text-foreground line-clamp-1 group-hover:text-brand-blue transition-colors">
                {title}
              </h3>
            </div>

            <div className="text-xl font-bold text-foreground tracking-tight">
              {formattedPrice}
              <span className="text-xs font-normal text-muted-foreground ml-1">
                / month
              </span>
            </div>

            {/* Location Pin */}
            <div className="flex items-center text-xs text-muted-foreground gap-1.5 pt-0.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 stroke-[2]" />
              <span className="truncate">{locationText}</span>
            </div>
          </div>

          {/* Property Features */}
          <div className="card-divider" />
          <div className="flex flex-wrap items-center gap-2 pt-3">
            {houseType && (
              <Badge
                variant="outline"
                className="text-[11px] font-medium capitalize bg-muted/30 border-border/80"
              >
                {houseType}
              </Badge>
            )}
            {bedrooms > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md">
                <Bed className="h-3.5 w-3.5 stroke-[2]" />
                {bedrooms} {bedrooms === 1 ? "Bed" : "Beds"}
              </span>
            )}
            {bathrooms > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md">
                <Bath className="h-3.5 w-3.5 stroke-[2]" />
                {bathrooms} {bathrooms === 1 ? "Bath" : "Baths"}
              </span>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="pt-1">
            <Button
              asChild
              className="w-full gap-2 text-xs font-semibold h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
            >
              <Link to={`/properties/${propertyId}`}>
                View Details
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    images: PropTypes.arrayOf(PropTypes.string),
    estate: PropTypes.string,
    county: PropTypes.string,
    location: PropTypes.string,
    houseType: PropTypes.string,
    bedrooms: PropTypes.number,
    bathrooms: PropTypes.number,
    status: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func,
  isSaved: PropTypes.bool,
};

export default PropertyCard;