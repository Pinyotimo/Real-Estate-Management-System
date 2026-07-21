import PropTypes from "prop-types";

const InquiryForm = ({ inquiry, setInquiry, onSubmit, sent }) => {
  return (
    <div>
      <h3 className="dashboard-section-title">Contact Agent</h3>
      {sent ? (
        <div className="dashboard-pill dashboard-pill--success" style={{ display: "block", padding: "0.75rem", marginTop: "0.5rem" }}>
          ✅ Inquiry sent! The agent will get back to you shortly.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="dashboard-form-stack">
          <input
            type="text"
            placeholder="Your Name"
            required
            value={inquiry.name}
            onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
            className="dashboard-input"
          />
          <input
            type="email"
            placeholder="Your Email"
            required
            value={inquiry.email}
            onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
            className="dashboard-input"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            required
            value={inquiry.phone}
            onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })}
            className="dashboard-input"
          />
          <textarea
            placeholder="I am interested in this property..."
            required
            value={inquiry.message}
            onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
            className="dashboard-input"
            style={{ minHeight: "80px" }}
          />
          <button type="submit" className="dashboard-btn dashboard-btn--success">
            Send Message
          </button>
        </form>
      )}
    </div>
  );
};

InquiryForm.propTypes = {
  inquiry: PropTypes.object.isRequired,
  setInquiry: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  sent: PropTypes.bool.isRequired,
};

export default InquiryForm;