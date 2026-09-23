import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Loader2, Save, Building2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import API from "../../api";
import { getHouseTypesForCategory } from "../../data/propertyTypes";
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

const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  price: "",
  listingType: "For Rent",
  propertyCategory: "Residential",
  houseType: "Residential House",
  amenities: "",
  bedrooms: "1",
  bathrooms: "1",
  squareMeters: "",
  mapLocation: "",
  condition: "Excellent",
};

const AddProperty = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const location = usePropertyLocation();
  const media = useMediaUpload(12);

  const houseTypeOptions = getHouseTypesForCategory(formData.propertyCategory);

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
      houseType: newHouseTypes[0] || "",
    }));
  };

  const handleDismissError = () => {
    setError(null);
    if (media.setError) media.setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) return;

    setUploading(true);
    setError(null);

    const data = new FormData();

    // Safely append form fields
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value ?? "");
    });

    // Append location data safely
    data.append("county", location?.county || "");
    data.append("estate", location?.estate || "");

    // Append media files
    if (media.mediaFiles?.length) {
      media.mediaFiles.forEach((file) => data.append("media", file));
    }

    try {
      await API.post("/properties", data);
      navigate("/", { state: { success: "Property listed successfully!" } });
    } catch (err) {
      console.error("Submission Error:", err.response?.data || err.message);

      const status = err?.response?.status;
      if (status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (status === 403) {
        setError(
          "Access denied: Only agents and admins are allowed to post properties."
        );
      } else {
        setError(
          err?.response?.data?.message ||
            "Failed to create listing. Please check your connection and try again."
        );
      }
    } finally {
      setUploading(false);
    }
  };

  const combinedError = error || media.error;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border/60">
        <div className="flex items-start gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground rounded-full shadow-sm mt-1"
            aria-label="Go back"
            disabled={uploading}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Post a New Property
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
              Create a professional listing with photos, videos, and full details to attract the right tenants or buyers.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Card Container */}
      <Card className="border-border/50 bg-card shadow-sm transition-colors rounded-2xl overflow-hidden relative">
        <FormFeedback
          error={combinedError}
          onDismissError={handleDismissError}
        />

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Form Content Padding */}
          <div className="p-6 sm:p-10 space-y-12">
            <PropertyBasicsFields formData={formData} onChange={handleChange} />

            <ListingDetailsFields
              formData={formData}
              onChange={handleChange}
              onCategoryChange={handleCategoryChange}
              houseTypeOptions={houseTypeOptions}
            />

            <SpecsFields formData={formData} onChange={handleChange} />

            <LocationFields location={location} />

            <AmenitiesFields formData={formData} onChange={handleChange} />

            <MapLinkFields formData={formData} onChange={handleChange} />

            <MediaUploadFields
              fileInputRef={media.fileInputRef}
              mediaFiles={media.mediaFiles}
              filePreviews={media.filePreviews}
              onMediaChange={media.handleMediaChange}
              onRemoveFile={media.removeFile}
            />
          </div>

          {/* Sticky Form Actions */}
          <div className="sticky bottom-0 z-10 p-6 sm:px-10 border-t border-border/50 bg-background/95 backdrop-blur-sm flex flex-col-reverse sm:flex-row items-center justify-end gap-3 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.05)]">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
              disabled={uploading}
              className="w-full sm:w-auto gap-2 font-medium"
            >
              <Save className="w-4 h-4 text-muted-foreground" />
              <span>Cancel / Save Draft</span>
            </Button>

            <Button
              type="submit"
              disabled={uploading}
              className="w-full sm:w-auto gap-2 font-semibold shadow-md hover:shadow-lg transition-all"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing…</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                  <span>Publish Property Listing</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddProperty;