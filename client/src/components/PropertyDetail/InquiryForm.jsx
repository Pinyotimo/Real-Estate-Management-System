import React from "react";
import PropTypes from "prop-types";
import {
  Send,
  Loader2,
  CheckCircle2,
  Lock,
  MessageSquarePlus,
  Clock,
  Calendar,
  Sparkles,
  PhoneCall,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const PRESET_MESSAGES = [
  "I'd like to schedule a viewing",
  "Is the rent or service charge negotiable?",
  "Can you send floor plans or virtual tour?",
  "When is this property available for move-in?",
];

const InquiryForm = ({
  inquiry,
  setInquiry,
  onSubmit,
  sent = false,
  isSubmitting = false,
  agent = { name: "Property Agent", role: "Listing Manager" },
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInquiry((prev) => ({ ...prev, [name]: value }));
  };

  const handleChipClick = (msg) => {
    setInquiry((prev) => ({
      ...prev,
      message: prev.message ? `${prev.message}\n${msg}` : msg,
    }));
  };

  const agentName = agent?.name || "Property Agent";
  const initial = agentName.charAt(0).toUpperCase();

  return (
    <Card className="relative overflow-hidden border-border bg-card shadow-xs transition-all">
      {/* Top Accent Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-indigo-600 to-violet-600" />

      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Header Info */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-border">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="w-8 h-8 rounded-lg border border-primary/20">
              <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold text-xs">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-foreground truncate">
                Inquire with {agentName}
              </h3>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span>Replies ~1 hr</span>
              </p>
            </div>
          </div>

          <Badge
            variant="secondary"
            className="hidden sm:inline-flex gap-1 text-[10px] font-semibold bg-primary/10 text-primary border-primary/20"
          >
            <Sparkles className="w-3 h-3" /> Direct Agent
          </Badge>
        </div>

        {sent ? (
          /* Success View */
          <div className="py-6 text-center space-y-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                Inquiry Delivered!
              </h4>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1 leading-relaxed">
                Your inquiry has been sent to{" "}
                <span className="font-semibold text-foreground">
                  {agentName}
                </span>
                . Check your email or phone for a response soon.
              </p>
            </div>
          </div>
        ) : (
          /* Form Inputs */
          <form onSubmit={onSubmit} className="space-y-3">
            {/* 1. Full Name */}
            <div className="space-y-1">
              <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Jane Doe"
                required
                disabled={isSubmitting}
                value={inquiry.name || ""}
                onChange={handleChange}
                className="h-8 text-xs bg-muted/40 rounded-lg"
              />
            </div>

            {/* 2. Email Address */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="jane@example.com"
                required
                disabled={isSubmitting}
                value={inquiry.email || ""}
                onChange={handleChange}
                className="h-8 text-xs bg-muted/40 rounded-lg"
              />
            </div>

            {/* 3. Phone Number */}
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+254 7..."
                required
                disabled={isSubmitting}
                value={inquiry.phone || ""}
                onChange={handleChange}
                className="h-8 text-xs bg-muted/40 rounded-lg"
              />
            </div>

            {/* 4. Preferred Tour Date */}
            <div className="space-y-1">
              <Label htmlFor="preferredDate" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3 text-primary" />
                Preferred Tour Date
              </Label>
              <Input
                id="preferredDate"
                name="preferredDate"
                type="date"
                disabled={isSubmitting}
                value={inquiry.preferredDate || ""}
                onChange={handleChange}
                className="h-8 text-xs bg-muted/40 rounded-lg text-foreground"
              />
            </div>

            {/* 5. Best Contact Method */}
            <div className="space-y-1">
              <Label htmlFor="contactMethod" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <PhoneCall className="w-3 h-3 text-primary" />
                Best Contact Method
              </Label>
              <select
                id="contactMethod"
                name="contactMethod"
                disabled={isSubmitting}
                value={inquiry.contactMethod || "WhatsApp"}
                onChange={handleChange}
                className="flex h-8 w-full rounded-lg border border-input bg-muted/40 px-2.5 py-1 text-xs shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Phone Call">Phone Call</option>
                <option value="Email">Email</option>
              </select>
            </div>

            {/* Preset Message Chips */}
            <div className="space-y-1.5 pt-0.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <MessageSquarePlus className="w-3 h-3 text-primary" />
                <span>Quick Presets</span>
              </Label>
              <div className="flex flex-wrap gap-1">
                {PRESET_MESSAGES.map((msg, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChipClick(msg)}
                    disabled={isSubmitting}
                    className="text-[10px] leading-tight px-2 py-1 rounded-md border border-border bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-50 cursor-pointer text-left"
                  >
                    + {msg}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Area */}
            <div className="space-y-1">
              <Label htmlFor="message" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Message <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Write your custom inquiry..."
                required
                rows={3}
                disabled={isSubmitting}
                value={inquiry.message || ""}
                onChange={handleChange}
                className="text-xs bg-muted/40 rounded-lg min-h-[60px] resize-y"
              />
            </div>

            {/* Action Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full gap-2 text-xs font-bold h-9 rounded-lg shadow-xs transition-all cursor-pointer mt-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message to Agent</span>
                </>
              )}
            </Button>

            {/* Privacy Note */}
            <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground pt-1">
              <Lock className="w-3 h-3 text-muted-foreground" />
              <span>Your contact info is safe and confidential.</span>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

InquiryForm.propTypes = {
  inquiry: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    message: PropTypes.string,
    preferredDate: PropTypes.string,
    contactMethod: PropTypes.string,
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