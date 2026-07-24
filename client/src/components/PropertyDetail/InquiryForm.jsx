import React from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';
import { Input, Textarea } from '../common/Form';
import Button from '../common/Button';

const InquiryForm = ({ inquiry, setInquiry, onSubmit, sent }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInquiry({ ...inquiry, [name]: value });
  };

  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Contact Agent</h3>
      {sent ? (
        <div className="p-4 text-sm text-success bg-success/10 rounded-md border border-success/20">
          Inquiry sent. The agent will get back to you shortly.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Your Name"
            name="name"
            type="text"
            placeholder="Full name"
            required
            value={inquiry.name}
            onChange={handleChange}
            className="w-full"
          />
          <Input
            label="Your Email"
            name="email"
            type="email"
            placeholder="name@example.com"
            required
            value={inquiry.email}
            onChange={handleChange}
            className="w-full"
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="+254..."
            required
            value={inquiry.phone}
            onChange={handleChange}
            className="w-full"
          />
          <Textarea
            label="Message"
            name="message"
            placeholder="I am interested in this property..."
            required
            value={inquiry.message}
            onChange={handleChange}
            rows="4"
            className="w-full"
          />
          <div className="flex justify-end">
            <Button type="submit" variant="success">
              Send Message
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
};

InquiryForm.propTypes = {
  inquiry: PropTypes.object.isRequired,
  setInquiry: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  sent: PropTypes.bool.isRequired,
};

export default InquiryForm;