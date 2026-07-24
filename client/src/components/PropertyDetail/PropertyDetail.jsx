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
  const [inquiry, setInquiry] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await API.get(`/properties/${id}`);
        const prop = data.data;
        setProperty(prop);

        // Set initial active media
        if (prop.images?.length > 0) {
          setActiveMedia({ type: "image", url: prop.images[0] });
        } else if (prop.video) {
          setActiveMedia({ type: "video", url: prop.video });
        } else if (prop.videos?.length > 0) {
          setActiveMedia({ type: "video", url: prop.videos[0] });
        }
      } catch (err) {
        console.error("Error fetching property details:", err);
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

  // Check if current user is owner or admin
  const isOwnerOrAdmin =
    user &&
    property &&
    (user._id === property.user?._id || user._id === property.user || user.role === "admin");

  if (!property) {
    return (
      <div className="dashboard-shell">
        <div className="dashboard-panel animate-shimmer" />
      </div>
    );
  }

  return (
    <div className="dashboard-shell property-detail-layout">
      <div className="dashboard-stack">
        <MediaGallery property={property} activeMedia={activeMedia} onMediaChange={setActiveMedia} />
        <PropertyInfo property={property} />
      </div>

      <aside>
        <div className="dashboard-panel sticky-panel">
          <InquiryForm
            inquiry={inquiry}
            setInquiry={setInquiry}
            onSubmit={handleInquirySubmit}
            sent={sent}
          />
          {isOwnerOrAdmin && (
            <OwnerActions
              onDelete={handleDelete}
              onEdit={() => navigate(`/properties/${property._id}/edit`)} // ✅ fixed: use property._id or id
            />
          )}
        </div>
      </aside>
    </div>
  );
};

export default PropertyDetail;