import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  RefreshCw,
  X,
  Image as ImageIcon,
  ChevronRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import API from "../../api";
import {
  getHouseTypesForCategory,
  getCategoryForHouseType,
} from "../../data/propertyTypes";
import { usePropertyLocation } from "./hooks/usePropertyLocation";
import { useMediaUpload } from "./hooks/useMediaUpload";
import FormFeedback from "./components/FormFeedback";
import PropertyBasicsFields from "./components/PropertyBasicsFields";
import ListingDetailsFields from "./components/ListingDetailsFields";
import LocationFields from "./components/LocationFields";
import SpecsFields from "./components/SpecsFields";
import AmenitiesFields from "./components/AmenitiesFields";
import MapLinkFields from "./components/MapLinkFields";
import MediaUploadFields from "./components/MediaUploadFields";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Existing property images/videos fetched from the database
  const [existingMedia, setExistingMedia] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    listingType: "For Rent",
    propertyCategory: "Residential",
    houseType: "Residential House",
    amenities: "",
    status: "vacant",
    bedrooms: "",
    bathrooms: "",
    squareMeters: "",
    condition: "Excellent",
    mapLocation: "",
    description: "",
  });

  const location = usePropertyLocation();
  const media = useMediaUpload(12); // Enables adding new photos/videos
  const houseTypeOptions = getHouseTypesForCategory(formData.propertyCategory);

  useEffect(() => {
    let isMounted = true;

    const fetchProperty = async () => {
      try {
        const { data } = await API.get(`/properties/${id}`);
        const property = data.data;
        if (!isMounted) return;

        setFormData({
          title: property.title || "",
          price: property.price || "",
          listingType: property.listingType || "For Rent",
          propertyCategory:
            property.propertyCategory ||
            getCategoryForHouseType(property.houseType),
          houseType: property.houseType || "Residential House",
          amenities: Array.isArray(property.amenities)
            ? property.amenities.join(", ")
            : property.amenities || "",
          status: property.status || "vacant",
          bedrooms: property.bedrooms || "",
          bathrooms: property.bathrooms || "",
          squareMeters: property.squareMeters || "",
          condition: property.condition || "Excellent",
          mapLocation: property.mapLocation || "",
          description: property.description || "",
        });

        // Populate existing media array
        const initialImages = property.images || property.media || [];
        setExistingMedia(
          Array.isArray(initialImages) ? initialImages : [initialImages]
        );

        location.hydrate(property.county || "", property.estate || "");
      } catch (err) {
        if (isMounted) {
          setError(
            "Failed to load property details. The listing may have been removed or you do not have permission."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProperty();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    const newHouseTypes = getHouseTypesForCategory(newCategory);
    setFormData((prev) => ({
      ...prev,
      propertyCategory: newCategory,
      houseType: newHouseTypes.includes(prev.houseType)
        ? prev.houseType
        : newHouseTypes[0] || "",
    }));
  };

  // Remove an existing image stored on the server
  const handleRemoveExistingMedia = (indexToRemove) => {
    setExistingMedia((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Use FormData to allow sending both existing URLs and new uploaded files
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      data.append("county", location.county);
      data.append("estate", location.estate);

      // Pass remaining existing media links to backend
      data.append("existingMedia", JSON.stringify(existingMedia));

      // Append new file uploads
      media.mediaFiles.forEach((file) => {
        data.append("media", file);
      });

      await API.put(`/properties/${id}`, data);
      setSuccess("Property updated successfully. Redirecting…");
      setTimeout(() => navigate(`/properties/${id}`), 1200);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Update failed. Please check your connection and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const combinedError = error || media.error;

  // --- Loading State ---
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-muted rounded-xl animate-pulse" />
        <Card className="p-6 space-y-6 bg-card border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-12 bg-muted/60 rounded-xl animate-pulse"
              />
            ))}
          </div>
          <div className="h-32 bg-muted/60 rounded-xl animate-pulse" />
        </Card>
      </div>
    );
  }

  // --- Initial Fetch Error State ---
  if (error && !formData.title) {
    return (
      <Card className="max-w-md mx-auto my-12 p-6 bg-card border-destructive/30 shadow-xs text-center">
        <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-foreground mb-2">
          Unable to Load Property
        </h3>
        <p className="text-xs text-muted-foreground mb-6">{error}</p>
        <div className="flex items-center justify-center gap-3">
          <Button
            type="button"
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Back to Portfolio</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Link
              to="/"
              className="hover:text-foreground transition-colors"
            >
              Properties
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              to={`/properties/${id}`}
              className="hover:text-foreground transition-colors"
            >
              Details
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">Edit</span>
          </nav>
          <h2 className="text-xl font-bold text-foreground">
            Edit Property Listing
          </h2>
        </div>

        <Button
          variant="outline"
          size="sm"
          asChild
          className="self-start sm:self-auto gap-1.5"
        >
          <Link to={`/properties/${id}`}>
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Details</span>
          </Link>
        </Button>
      </div>

      {/* Main Form Container */}
      <Card className="p-5 sm:p-8 border-border bg-card shadow-xs transition-colors rounded-2xl">
        <FormFeedback
          error={combinedError}
          success={success}
          onDismissError={() => setError(null)}
        />

        <form onSubmit={handleSubmit} className="space-y-8 mt-4">
          {/* Section 1: Basic Information */}
          <PropertyBasicsFields
            formData={formData}
            onChange={handleChange}
            idPrefix="edit-"
          />

          {/* Section 2: Category & Status */}
          <ListingDetailsFields
            formData={formData}
            onChange={handleChange}
            onCategoryChange={handleCategoryChange}
            houseTypeOptions={houseTypeOptions}
            showStatus
            idPrefix="edit-"
          />

          {/* Section 3: Specifications */}
          <SpecsFields
            formData={formData}
            onChange={handleChange}
            idPrefix="edit-"
          />

          {/* Section 4: Location */}
          <LocationFields location={location} idPrefix="edit-" />

          {/* Section 5: Amenities */}
          <AmenitiesFields
            formData={formData}
            onChange={handleChange}
            idPrefix="edit-"
          />

          {/* Section 6: Map Link */}
          <MapLinkFields
            formData={formData}
            onChange={handleChange}
            idPrefix="edit-"
          />

          {/* Section 7: Media Management (Existing Photos + Add New) */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                <span>Property Media & Gallery</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage existing photos or upload new high-resolution images.
              </p>
            </div>

            {/* Render Existing Images Grid */}
            {existingMedia.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-foreground">
                  Current Uploaded Photos ({existingMedia.length})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {existingMedia.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-xl overflow-hidden border border-border aspect-video bg-muted"
                    >
                      <img
                        src={url}
                        alt={`Property ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveExistingMedia(idx)}
                        className="absolute top-1.5 right-1.5 h-6 w-6 opacity-90 group-hover:opacity-100 transition-all"
                        title="Remove photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Component to Upload New Photos/Videos */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-foreground block mb-2">
                Add Additional Photos / Videos
              </span>
              <MediaUploadFields
                fileInputRef={media.fileInputRef}
                mediaFiles={media.mediaFiles}
                filePreviews={media.filePreviews}
                onMediaChange={media.handleMediaChange}
                onRemoveFile={media.removeFile}
              />
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="pt-6 border-t border-border flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <Button
              variant="outline"
              asChild
              className="w-full sm:w-auto"
            >
              <Link to={`/properties/${id}`}>Cancel</Link>
            </Button>

            <Button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes…</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditProperty;