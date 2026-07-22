import PropTypes from "prop-types";

const InquiryForm = ({ inquiry, setInquiry, onSubmit, sent }) => {
  return (
    <>
      <style>{`
        .inquiry-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }
        .inquiry-success {
          text-align: center;
          padding: 2rem 1.5rem;
          background: var(--success-soft);
          border: 1px solid var(--success);
          border-radius: var(--radius);
        }
        .inquiry-success-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .inquiry-success-title {
          font-weight: 700;
          color: var(--success);
          margin-bottom: 0.25rem;
        }
        .inquiry-success-subtext {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .inquiry-field-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
        }
      `}</style>

      <div>
        <h3 className="dashboard-section-title">Contact Agent</h3>

        {sent ? (
          <div className="inquiry-success">
            <div className="inquiry-success-icon">✅</div>
            <div className="inquiry-success-title">Inquiry Sent!</div>
            <div className="inquiry-success-subtext">
              The agent will get back to you shortly.
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="inquiry-card dashboard-form-stack">
            <div className="inquiry-field-row">
              <div>
                <label className="dashboard-label">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jane Wanjiru"
                  required
                  value={inquiry.name}
                  onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                  className="dashboard-input"
                />
              </div>
              <div>
                <label className="dashboard-label">Phone Number</label>
                <input
                  type="tel"
                  placeholder="07XX XXX XXX"
                  required
                  value={inquiry.phone}
                  onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })}
                  className="dashboard-input"
                />
              </div>
            </div>

            <div>
              <label className="dashboard-label">Your Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={inquiry.email}
                onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
                className="dashboard-input"
              />
            </div>

            <div>
              <label className="dashboard-label">Message</label>
              <textarea
                placeholder="I am interested in this property..."
                required
                value={inquiry.message}
                onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                className="dashboard-input"
                style={{ minHeight: "80px", resize: "vertical" }}
              />
            </div>

            <button type="submit" className="dashboard-btn dashboard-btn--success">
              Send Message
            </button>
          </form>
        )}
      </div>
    </>
  );
};

InquiryForm.propTypes = {
  inquiry: PropTypes.object.isRequired,
  setInquiry: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  sent: PropTypes.bool.isRequired,
};

export default InquiryForm;