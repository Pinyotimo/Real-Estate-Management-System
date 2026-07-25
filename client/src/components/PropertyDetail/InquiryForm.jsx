import React from 'react';
import PropTypes from 'prop-types';

const PRESET_MESSAGES = [
  "I'd like to schedule a viewing",
  "Is the rent or service charge negotiable?",
  "Can you send floor plans or virtual tour?",
  "When is this property available for move-in?"
];

const InquiryForm = ({ 
  inquiry, 
  setInquiry, 
  onSubmit, 
  sent = false, 
  isSubmitting = false,
  agent = { name: "Property Agent", role: "Listing Manager" } 
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInquiry((prev) => ({ ...prev, [name]: value }));
  };

  const handleChipClick = (msg) => {
    setInquiry((prev) => ({
      ...prev,
      message: prev.message ? `${prev.message}\n${msg}` : msg
    }));
  };

  return (
    <div className="dashboard-card" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Brand Accent Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'var(--brand-blue)',
        zIndex: 1
      }} />

      {/* Agent Profile Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border)',
        marginBottom: '0.5rem'
      }}>
        <div className="avatar" style={{ width: '40px', height: '40px', fontSize: '0.9rem', flexShrink: 0 }}>
          {agent.name.charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            margin: 0
          }}>
            {agent.name}
          </h3>
          <p style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            margin: '0.15rem 0 0'
          }}>
            <span style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--brand-blue)',
              flexShrink: 0
            }} />
            Typically replies within 1 hour
          </p>
        </div>
      </div>

      {sent ? (
        /* Success Confirmation */
        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--brand-very-light-blue)',
            color: 'var(--brand-blue)',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 0.75rem',
            border: '2px solid var(--brand-light-blue)'
          }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.35rem' }}>
            Inquiry Delivered!
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '260px', margin: '0 auto', lineHeight: 1.5 }}>
            Your message was routed directly to {agent.name}. Expect a phone call or reply in your email inbox shortly.
          </p>
        </div>
      ) : (
        /* Inquiry Form */
        <form onSubmit={onSubmit} className="dashboard-stack">
          <div>
            <label className="dashboard-label required">Full Name</label>
            <input
              className="dashboard-input"
              name="name"
              type="text"
              placeholder="e.g. Alice Johnson"
              required
              disabled={isSubmitting}
              value={inquiry.name}
              onChange={handleChange}
            />
          </div>

          <div className="dashboard-form-row" style={{ padding: 0, background: 'transparent', border: 'none', marginBottom: 0 }}>
            <div>
              <label className="dashboard-label required">Email</label>
              <input
                className="dashboard-input"
                name="email"
                type="email"
                placeholder="alice@example.com"
                required
                disabled={isSubmitting}
                value={inquiry.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="dashboard-label required">Phone Number</label>
              <input
                className="dashboard-input"
                name="phone"
                type="tel"
                placeholder="+254 7..."
                required
                disabled={isSubmitting}
                value={inquiry.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Quick Message Chips */}
          <div>
            <label className="dashboard-label" style={{ marginBottom: '0.5rem' }}>
              Quick Questions (Click to add):
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {PRESET_MESSAGES.map((msg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChipClick(msg)}
                  disabled={isSubmitting}
                  className="dashboard-pill"
                  style={{
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    padding: '0.3rem 0.65rem',
                    border: '1px solid var(--border)',
                    background: 'var(--surface-soft)',
                    textTransform: 'none',
                    letterSpacing: '0'
                  }}
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="dashboard-label required">Message</label>
            <textarea
              className="dashboard-input"
              name="message"
              placeholder="Type your inquiry or select a quick question above..."
              required
              disabled={isSubmitting}
              value={inquiry.message}
              onChange={handleChange}
              rows={4}
              style={{ resize: 'vertical', minHeight: '90px' }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="dashboard-btn dashboard-btn--primary full-width"
            style={{ marginTop: '0.25rem' }}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-pulse" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Sending Inquiry...</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Send Message to Agent</span>
              </>
            )}
          </button>

          {/* Privacy Guard */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            paddingTop: '0.25rem'
          }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Your contact details are kept private & confidential.</span>
          </div>
        </form>
      )}
    </div>
  );
};

InquiryForm.propTypes = {
  inquiry: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    message: PropTypes.string,
  }).isRequired,
  setInquiry: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  sent: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  agent: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
  }),
};

export default InquiryForm;