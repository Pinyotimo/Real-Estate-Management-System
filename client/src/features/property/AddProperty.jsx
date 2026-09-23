import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Loader2, Save } from "lucide-react";

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
      // Axios automatically configures Content-Type boundaries when passing FormData
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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Go back"
              disabled={uploading}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-bold text-foreground">
              Post a New Property
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1 sm:ml-10">
            Create a professional listing with photos, videos, and full details.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          disabled={uploading}
          className="self-start sm:self-auto"
        >
          Cancel
        </Button>
      </div>

      {/* Main Form Card Container */}
      <Card className="p-5 sm:p-8 border-border bg-card shadow-xs transition-colors rounded-2xl">
        <FormFeedback
          error={combinedError}
          onDismissError={handleDismissError}
        />

        <form onSubmit={handleSubmit} className="space-y-8 mt-4">
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

          {/* Form Actions */}
          <div className="pt-6 border-t border-border flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={uploading}
              className="w-full sm:w-auto gap-2"
            >
              <Save className="w-4 h-4 text-muted-foreground" />
              <span>Cancel / Save Draft</span>
            </Button>

            <Button
              type="submit"
              disabled={uploading}
              className="w-full sm:w-auto gap-2"
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