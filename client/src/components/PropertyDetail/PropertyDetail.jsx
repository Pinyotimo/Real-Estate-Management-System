import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Share2, AlertTriangle, Home } from "lucide-react";

import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import MediaGallery from "./MediaGallery";
import PropertyInfo from "./PropertyInfo";
import AgentContactCard from "./AgentContactCard";
import InquiryForm from "./InquiryForm";
import OwnerActions from "./OwnerActions";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [property, setProperty] = useState(null);
  const [activeMedia, setActiveMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [inquiry, setInquiry] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sent, setSent] = useState(false);

  // Auto-fill inquiry details if user is logged in
  useEffect(() => {
    if (user) {
      setInquiry((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  // Fetch property details
  const fetchProperty = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get(`/properties/${id}`);
      const prop = data.data;
      setProperty(prop);

      // Initialize active media element safely
      if (prop?.images?.length > 0) {
        setActiveMedia({ type: "image", url: prop.images[0] });
      } else if (prop?.video) {
        setActiveMedia({ type: "video", url: prop.video });
      } else if (prop?.videos?.length > 0) {
        setActiveMedia({ type: "video", url: prop.videos[0] });
      }
    } catch (err) {
      console.error("Error fetching property details:", err);
      setError(
        err.response?.data?.message ||
          "Property not found or failed to load."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  // Handle Inquiry Form Submission
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.post("/inquiries", { ...inquiry, propertyId: id });
      setSent(true);
      toast.success("Your inquiry has been sent to the property manager!");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to send inquiry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Listing Deletion (Triggered from OwnerActions AlertDialog)
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await API.delete(`/properties/${id}`);
      toast.success("Property listing deleted successfully.");
      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete property listing."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Copy Link to Clipboard
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Property link copied to clipboard!");
  };

  // Determine owner or administrative privilege
  const isOwnerOrAdmin =
    user &&
    property &&
    (user._id === property.user?._id ||
      user._id === property.user ||
      user.role === "admin");

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="w-full h-96 rounded-2xl" />
            <Skeleton className="h-8 rounded w-2/3" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-72 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !property) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Card className="max-w-lg mx-auto border-border bg-card p-8 sm:p-12 text-center my-12 rounded-3xl shadow-xs">
          <CardContent className="p-0 space-y-4">
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Listing Unavailable
              </h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {error || "This property listing could not be found or has been removed."}
              </p>
            </div>
            <Button asChild className="gap-2 rounded-xl mt-4 cursor-pointer">
              <Link to="/">
                <Home className="w-4 h-4" />
                Back to All Listings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6"
    >
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-2 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Listings</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="gap-2 rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Listing</span>
        </Button>
      </div>

      {/* Grid Layout: Main Content (Left) + Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details (2 Columns on Large Screens) */}
        <div className="lg:col-span-2 space-y-6">
          <MediaGallery
            property={property}
            activeMedia={activeMedia}
            onMediaChange={setActiveMedia}
          />
          <PropertyInfo property={property} />
        </div>

        {/* Sticky Sidebar (1 Column on Large Screens) */}
        <aside className="space-y-6 lg:sticky lg:top-6 self-start">
          <AgentContactCard agent={property.user} />

          <div className="space-y-4">
            <InquiryForm
              inquiry={inquiry}
              setInquiry={setInquiry}
              onSubmit={handleInquirySubmit}
              isSubmitting={isSubmitting}
              sent={sent}
              agent={property.user}
            />

            {isOwnerOrAdmin && (
              <Card className="border-border bg-card p-4 rounded-2xl shadow-xs">
                <OwnerActions
                  isDeleting={isDeleting}
                  onDelete={handleDelete}
                  onEdit={() => navigate(`/properties/${property._id}/edit`)}
                />
              </Card>
            )}
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

export default PropertyDetail;