import React from "react";
import PropTypes from "prop-types";
import { User, Phone, Mail, MessageCircle, ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const getInitials = (name = "Agent") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const cleanPhoneForWhatsApp = (phone) => phone.replace(/\D/g, "");

const AgentContactCard = ({ agent }) => {
  if (!agent) return null;

  const agentName = agent.name || "Property Agent";
  const initials = getInitials(agentName);
  const whatsappUrl = agent.phone
    ? `https://wa.me/${cleanPhoneForWhatsApp(agent.phone)}`
    : null;

  return (
    <Card className="rounded-2xl border-border bg-card shadow-xs transition-all">
      <CardContent className="p-5 sm:p-6 space-y-5">
        {/* Header Title */}
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <User className="w-4 h-4 text-primary" />
          <span>Listed By</span>
        </div>

        {/* Agent Profile Header */}
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <Avatar className="w-12 h-12 rounded-xl border border-border shadow-xs">
              <AvatarImage
                src={agent.profilePicture}
                alt={agentName}
                className="object-cover"
              />
              <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-extrabold text-base border border-primary/20">
                {initials}
              </AvatarFallback>
            </Avatar>
            {/* Availability Indicator */}
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-background rounded-full"
              title="Available"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-foreground truncate">
                {agentName}
              </h3>
              <ShieldCheck
                className="w-4 h-4 text-primary shrink-0"
                title="Verified Agent"
              />
            </div>

            {agent.username && (
              <p className="text-xs text-muted-foreground truncate">
                @{agent.username}
              </p>
            )}

            <div className="mt-1">
              <Badge
                variant="secondary"
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
              >
                {agent.role || "Listing Agent"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action CTA Buttons */}
        <div className="space-y-2.5 pt-1">
          {agent.phone && (
            <Button
              asChild
              className="w-full gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold h-10 shadow-xs transition-all"
            >
              <a href={`tel:${agent.phone}`}>
                <Phone className="w-4 h-4" />
                <span>Call Agent</span>
              </a>
            </Button>
          )}

          {whatsappUrl && (
            <Button
              asChild
              variant="outline"
              className="w-full gap-2 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20 active:scale-[0.98] font-semibold h-10 shadow-xs transition-all"
            >
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </a>
            </Button>
          )}

          {agent.email && (
            <Button
              asChild
              variant="outline"
              className="w-full gap-2 rounded-xl font-semibold h-10 shadow-xs text-foreground active:scale-[0.98] transition-all"
            >
              <a href={`mailto:${agent.email}`} className="truncate">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="truncate">{agent.email}</span>
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

AgentContactCard.propTypes = {
  agent: PropTypes.shape({
    name: PropTypes.string,
    username: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    profilePicture: PropTypes.string,
    role: PropTypes.string,
  }),
};

export default AgentContactCard;