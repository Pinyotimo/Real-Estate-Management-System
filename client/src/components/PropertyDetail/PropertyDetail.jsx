import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api";
import { AuthContext } from "../../context/AuthContext";
import MediaGallery from "./MediaGallery";
import PropertyInfo from "./PropertyInfo";
import InquiryForm from "./InquiryForm";
import OwnerActions from "./OwnerActions";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

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
  useEffect(() => {
    const fetchProperty = async () => {
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
        setError(err.response?.data?.message || "Property not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.post("/inquiries", { ...inquiry, propertyId: id });
      setSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this property listing? This action cannot be undone.")) {
      try {
        await API.delete(`/properties/${id}`);
        navigate("/");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete property.");
      }
    }
  };

  // Determine owner or administrative privilege
  const isOwnerOrAdmin =
    user &&
    property &&
    (user._id === property.user?._id || user._id === property.user || user.role === "admin");

  if (loading) {
    return (
      <div className="dashboard-shell">
        <div className="dashboard-panel animate-shimmer min-h-[400px]" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="dashboard-shell">
        <div className="dashboard-panel p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-destructive">Listing Unavailable</h2>
          <p className="text-muted-foreground">{error || "This property listing could not be found."}</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md shadow hover:opacity-90 transition-opacity"
          >
            Back to All Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell property-detail-layout">
      <div className="dashboard-stack">
        <MediaGallery
          property={property}
          activeMedia={activeMedia}
          onMediaChange={setActiveMedia}
        />
        <PropertyInfo property={property} />
      </div>

      <aside>
        <div className="dashboard-panel sticky-panel">
          <InquiryForm
            inquiry={inquiry}
            setInquiry={setInquiry}
            onSubmit={handleInquirySubmit}
            isSubmitting={isSubmitting}
            sent={sent}
          />
          {isOwnerOrAdmin && (
            <OwnerActions
              onDelete={handleDelete}
              onEdit={() => navigate(`/properties/${property._id}/edit`)}
            />
          )}
        </div>
      </aside>
    </div>
  );
};

export default PropertyDetail;