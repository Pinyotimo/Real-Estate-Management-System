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
  const [error, setError] = useState("");
  const [activeMedia, setActiveMedia] = useState(null);
  const [inquiry, setInquiry] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setError("");
      try {
        const { data } = await API.get(`/properties/${id}`);
        const prop = data.data;
        setProperty(prop);

        if (prop.images?.length > 0) {
          setActiveMedia({ type: "image", url: prop.images[0] });
        } else if (prop.video) {
          setActiveMedia({ type: "video", url: prop.video });
        } else if (prop.videos?.length > 0) {
          setActiveMedia({ type: "video", url: prop.videos[0] });
        }
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError("Could not load this property. It may have been removed.");
      }
    };
    fetchProperty();
  }, [id]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/inquiries", { ...inquiry, propertyId: id });
      setSent(true);
    } catch (err) {
      alert("Failed to send inquiry.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await API.delete(`/properties/${id}`);
        navigate("/");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete property.");
      }
    }
  };

  const isOwnerOrAdmin =
    user &&
    property &&
    (user._id === property.user?._id || user._id === property.user || user.role === "admin");

  return (
    <>
      <style>{`
        .property-detail-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }
        @media (max-width: 900px) {
          .property-detail-layout {
            grid-template-columns: 1fr;
          }
        }
        .property-detail-sidebar {
          position: sticky;
          top: 2rem;
        }
        @media (max-width: 900px) {
          .property-detail-sidebar {
            position: static;
          }
        }
        .property-detail-skeleton {
          display: grid;
          gap: 1.5rem;
        }
        .property-detail-skeleton-media {
          height: 380px;
          border-radius: var(--radius);
        }
        .property-detail-skeleton-line {
          height: 1rem;
          border-radius: 4px;
          width: 60%;
        }
        .property-detail-skeleton-line--wide {
          width: 90%;
        }
        .property-detail-error {
          text-align: center;
          max-width: 480px;
          margin: 3rem auto;
        }
      `}</style>

      {error ? (
        <div className="dashboard-shell property-detail-error">
          <div className="dashboard-panel">
            <p className="auth-error" style={{ display: "inline-block" }}>
              {error}
            </p>
            <div style={{ marginTop: "1rem" }}>
              <button className="dashboard-btn" onClick={() => navigate("/")}>
                Back to Listings
              </button>
            </div>
          </div>
        </div>
      ) : !property ? (
        <div className="dashboard-shell">
          <div className="property-detail-layout">
            <div className="property-detail-skeleton">
              <div className="property-detail-skeleton-media animate-shimmer" />
              <div className="property-detail-skeleton-line animate-shimmer property-detail-skeleton-line--wide" />
              <div className="property-detail-skeleton-line animate-shimmer" />
            </div>
            <div className="dashboard-panel property-detail-skeleton">
              <div className="property-detail-skeleton-line animate-shimmer property-detail-skeleton-line--wide" />
              <div className="property-detail-skeleton-line animate-shimmer" />
              <div className="property-detail-skeleton-line animate-shimmer" />
            </div>
          </div>
        </div>
      ) : (
        <div className="dashboard-shell property-detail-layout">
          {/* Left column: Media + Info */}
          <div className="dashboard-stack">
            <MediaGallery property={property} activeMedia={activeMedia} onMediaChange={setActiveMedia} />
            <PropertyInfo property={property} />
          </div>

          {/* Right column: Inquiry + Owner actions */}
          <div>
            <div className="dashboard-panel property-detail-sidebar">
              <InquiryForm
                inquiry={inquiry}
                setInquiry={setInquiry}
                onSubmit={handleInquirySubmit}
                sent={sent}
              />
              {isOwnerOrAdmin && <OwnerActions onDelete={handleDelete} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyDetail;