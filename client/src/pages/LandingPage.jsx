import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  BarChart3,
  Bell,
  Check,
  ClipboardList,
  CreditCard,
  Home,
  Key,
  LayoutDashboard,
  MapPinned,
  Menu,
  Search,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Wrench,
  X,
} from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import API from "@/api";

/* -------------------------------------------------------------------------- */
/*  Static content                                                            */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Workspaces", href: "#workspaces" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Listings", href: "#listings" },
];

const STATS = [
  { value: "1,200+", label: "Managed units" },
  { value: "38", label: "Counties covered" },
  { value: "99.9%", label: "Platform uptime" },
  { value: "3", label: "Role workspaces" },
];

const FEATURES = [
  {
    Icon: Building2,
    title: "Listing intelligence",
    body: "Search every unit by county, estate, price band, or bedroom count — then compare records side by side without leaving the page.",
  },
  {
    Icon: TrendingUp,
    title: "Revenue & rent roll",
    body: "Track occupancy, collections, and arrears in real time. Export the rent roll to CSV for your finance review in one click.",
  },
  {
    Icon: Users,
    title: "Tenant workspaces",
    body: "Give residents a dedicated portal for payments, receipts, applications, and service complaints — no shared logins.",
  },
  {
    Icon: Wrench,
    title: "Maintenance & assignments",
    body: "Route service requests to the right agent, log every assignment, and close the loop with the resident automatically.",
  },
  {
    Icon: Bell,
    title: "Live notifications",
    body: "Inquiries, new enquiries, and assignment updates arrive the moment they happen, so nothing slips through the cracks.",
  },
  {
    Icon: Shield,
    title: "Governed access",
    body: "Role-based workspaces for admins, agents, and tenants, backed by hashed credentials and a full audit trail of every action.",
  },
];

const WORKSPACES = [
  {
    Icon: Shield,
    role: "Admin",
    accent: "text-purple-600 dark:text-purple-400",
    chip: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    summary:
      "Full oversight of users, listings, and platform activity with an auditable record of every administrative action.",
    points: ["User & role management", "System-wide audit log", "Listing moderation"],
  },
  {
    Icon: ClipboardList,
    role: "Agent",
    accent: "text-brand-blue",
    chip: "bg-brand-very-light-blue text-brand-blue border-brand-blue/25",
    summary:
      "Run your book of business from a single workspace — publish listings, assign work, and chase arrears.",
    points: ["List & edit properties", "Assignment pipeline", "Revenue analytics"],
  },
  {
    Icon: Key,
    role: "Tenant",
    accent: "text-emerald-600 dark:text-emerald-400",
    chip: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    summary:
      "A calm, focused portal for residents to pay rent, download receipts, and raise issues with their agent.",
    points: ["Rent & receipts", "Service complaints", "Applications"],
  },
];

const STEPS = [
  {
    Icon: Search,
    title: "Discover the portfolio",
    body: "Guests browse the live property index. Filter by location, price, and property type to find the right unit.",
  },
  {
    Icon: LayoutDashboard,
    title: "Claim your workspace",
    body: "Create an account with the role that matches how you work. Each role opens onto its own tailored dashboard.",
  },
  {
    Icon: BarChart3,
    title: "Operate from one place",
    body: "Occupancy, rent roll, payments, and maintenance flow into the same numbers everyone trusts.",
  },
];

const FALLBACK_PROPERTIES = [
  {
    _id: "sample-1",
    title: "Garden Court — 3 Bedroom Apartment",
    price: 85000,
    estate: "Kilimani",
    county: "Nairobi",
    houseType: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    status: "vacant",
  },
  {
    _id: "sample-2",
    title: "Riverside Heights — 2 Bedroom Apartment",
    price: 65000,
    estate: "Westlands",
    county: "Nairobi",
    houseType: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    status: "occupied",
  },
  {
    _id: "sample-3",
    title: "Karen Grove — 4 Bedroom House",
    price: 145000,
    estate: "Karen",
    county: "Nairobi",
    houseType: "house",
    bedrooms: 4,
    bathrooms: 3,
    status: "vacant",
  },
];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(price || 0);

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                     */
/* -------------------------------------------------------------------------- */

const SectionHeading = ({ eyebrow, title, body, align = "center" }) => (
  <div
    className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}
  >
    <Badge
      variant="secondary"
      className="mb-4 gap-1.5 rounded-full border border-brand-blue/20 bg-brand-very-light-blue px-3 py-1 text-brand-blue"
    >
      <Sparkles className="h-3 w-3" />
      {eyebrow}
    </Badge>
    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
      {title}
    </h2>
    {body && (
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
        {body}
      </p>
    )}
  </div>
);

/**
 * Scroll reveal that can never strand content off-screen.
 *
 * Deliberately CSS-driven rather than animation-library-driven: the reveal is
 * a plain class toggle, and a position poll guarantees the element is shown
 * as soon as it is genuinely on screen even if the observer never reports.
 */
const Reveal = ({ children, delay = 0, className = "" }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    let observer;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.05, rootMargin: "0px 0px -60px 0px" }
      );
      observer.observe(node);
    }

    // Safety net: reveal whenever the element is actually within the viewport.
    const poll = setInterval(() => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setVisible(true);
        observer?.disconnect();
        clearInterval(poll);
      }
    }, 300);

    return () => {
      observer?.disconnect();
      clearInterval(poll);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal--in" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Header                                                                     */
/* -------------------------------------------------------------------------- */

const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMenuOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled
          ? "border-border bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70"
          : "border-transparent bg-background/60 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/landing" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue text-white shadow-soft">
            <Building2 className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold tracking-tight text-foreground">
              Davis &amp; Shirtliff
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Real Estate Manager
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            asChild
            variant="ghost"
            className="hidden h-9 px-3 text-sm sm:inline-flex"
          >
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild className="h-9 gap-1.5 px-3.5 text-sm">
            <Link to="/register">
              Get started
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          >
            {isMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav
          className="slide-down overflow-hidden border-t border-border bg-background md:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-1 p-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <Button asChild variant="outline" className="mt-2 w-full">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                Sign in
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
};

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

const HeroPreview = () => (
  <div className="relative">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-x-6 -top-10 bottom-0 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-blue/25 via-brand-blue/5 to-transparent blur-2xl"
    />

    <Card className="gap-0 overflow-hidden border-border bg-card p-0 shadow-float">
      {/* Preview chrome */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
          <MapPinned className="h-3 w-3" />
          Portfolio · Nairobi
        </span>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-[1.15fr_1fr] sm:p-5">
        {/* Left: mini stats */}
        <div className="space-y-3">
          {[
            { label: "Occupancy", value: "92%", tone: "text-brand-blue" },
            { label: "Collections", value: "98%", tone: "text-emerald-600 dark:text-emerald-400" },
            { label: "Arrears", value: "4", tone: "text-amber-600 dark:text-amber-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-3.5 py-3"
            >
              <span className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </span>
              <span className={`text-base font-bold ${stat.tone}`}>
                {stat.value}
              </span>
            </div>
          ))}

          <div className="rounded-xl border border-border bg-card p-3.5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                Revenue trend
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                +12.4%
              </span>
            </div>
            <div className="flex h-16 items-end gap-1.5">
              {[38, 52, 44, 61, 55, 72, 66, 84, 78, 92].map((height, index) => (
                <span
                  key={index}
                  className="bar-grow flex-1 rounded-t-sm bg-brand-blue/25 last:bg-brand-blue"
                  style={{
                    "--bar-height": `${height}%`,
                    "--bar-delay": `${300 + index * 50}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: mini listing cards */}
        <div className="space-y-3">
          {FALLBACK_PROPERTIES.map((property, index) => (
            <div
              key={property._id}
              className="slide-in flex items-center gap-3 rounded-xl border border-border bg-card p-2.5"
              style={{ "--slide-delay": `${150 + index * 100}ms` }}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-very-light-blue text-brand-blue">
                <Home className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">
                  {property.title}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {property.estate}, {property.county}
                </p>
              </div>
              <span className="shrink-0 text-xs font-bold text-foreground">
                {formatPrice(property.price).replace("KES", "KSh")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  </div>
);

const Hero = () => (
  <section className="relative overflow-hidden border-b border-border">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklch,var(--brand-blue)_14%,transparent),transparent)]"
    />

    <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
      <div className="rise-in" style={{ "--rise-delay": "0ms" }}>
        <Badge
          variant="secondary"
          className="mb-5 gap-1.5 rounded-full border border-brand-blue/20 bg-brand-very-light-blue px-3 py-1 text-brand-blue"
        >
          <Sparkles className="h-3 w-3" />
          One workspace for every role
        </Badge>

        <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Property operations,
          <span className="block text-brand-blue">finally in sync.</span>
        </h1>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Davis &amp; Shirtliff brings listings, occupancy, rent roll, payments,
          and maintenance into a single platform — with dedicated workspaces for
          admins, agents, and tenants.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-11 gap-2 px-6">
            <Link to="/register">
              Create your workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-11 px-6">
            <Link to="/">Browse properties</Link>
          </Button>
        </div>

        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5">
          {[
            "No credit card required",
            "Role-based from day one",
            "Full audit trail",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
            >
              <Check className="h-3.5 w-3.5 text-brand-blue" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="rise-in" style={{ "--rise-delay": "120ms" }}>
        <HeroPreview />
      </div>
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  Stats                                                                      */
/* -------------------------------------------------------------------------- */

const StatsBand = () => (
  <section className="border-b border-border bg-muted/40">
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
      {STATS.map((stat) => (
        <div key={stat.label} className="px-2 py-8 text-center">
          <p className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {stat.value}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  Features                                                                   */
/* -------------------------------------------------------------------------- */

const Features = () => (
  <section id="features" className="scroll-mt-20 py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Capabilities"
          title="Everything a property team touches, in one place"
          body="Stop reconciling spreadsheets, WhatsApp threads, and half-reconciled ledgers. Every workflow the platform supports lives here."
        />
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 0.06}>
            <Card className="group h-full gap-0 border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-float">
              <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-very-light-blue text-brand-blue transition-transform duration-300 group-hover:scale-110">
                <feature.Icon className="h-5 w-5" />
              </span>
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.body}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  Workspaces                                                                 */
/* -------------------------------------------------------------------------- */

const Workspaces = () => (
  <section
    id="workspaces"
    className="scroll-mt-20 border-y border-border bg-muted/30 py-20"
  >
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Workspaces"
          title="A tailored home for every role"
          body="The same platform, three focused experiences. Each role sees the tools and numbers that matter to them — and nothing else."
        />
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {WORKSPACES.map((workspace, index) => (
          <Reveal key={workspace.role} delay={index * 0.08}>
            <Card className="h-full gap-0 border-border bg-card p-6 shadow-soft sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border ${workspace.chip}`}
                >
                  <workspace.Icon className="h-5 w-5" />
                </span>
                <Badge
                  variant="outline"
                  className="rounded-full border-border text-[11px] font-semibold text-muted-foreground"
                >
                  {workspace.role}
                </Badge>
              </div>

              <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                {workspace.role} workspace
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {workspace.summary}
              </p>

              <ul className="mt-5 space-y-2.5 border-t border-border pt-5">
                {workspace.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2.5 text-sm text-text-secondary"
                  >
                    <Check className={`h-4 w-4 shrink-0 ${workspace.accent}`} />
                    {point}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  How it works                                                               */
/* -------------------------------------------------------------------------- */

const HowItWorks = () => (
  <section id="how-it-works" className="scroll-mt-20 py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="How it works"
          title="Up and running in three steps"
        />
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <Reveal key={step.title} delay={index * 0.1}>
            <div className="relative h-full">
              {index < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-11 top-11 hidden h-px w-[calc(100%-2.5rem)] bg-border md:block"
                />
              )}
              <div className="relative">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-blue/25 bg-brand-very-light-blue text-brand-blue">
                  <step.Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Step {index + 1}
                </p>
                <h3 className="mt-1 text-base font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  Featured listings                                                          */
/* -------------------------------------------------------------------------- */

const FeaturedListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    API.get("/properties")
      .then(({ data }) => {
        if (!active) return;
        const list = data?.data || [];
        setProperties(list.length ? list.slice(0, 3) : FALLBACK_PROPERTIES);
      })
      .catch(() => {
        if (active) setProperties(FALLBACK_PROPERTIES);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="listings"
      className="scroll-mt-20 border-y border-border bg-muted/30 py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Live listings"
            title="See what is on the market right now"
            body="A sample of the properties currently published across our portfolio. Sign in to search the complete index."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? [1, 2, 3].map((item) => (
                <Card key={item} className="gap-0 border-border bg-card p-0">
                  <Skeleton className="h-40 w-full rounded-none" />
                  <div className="space-y-3 p-5">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </Card>
              ))
            : properties.map((property, index) => (
                <Reveal key={property._id || index} delay={index * 0.08}>
                  <Card className="group h-full gap-0 overflow-hidden border-border bg-card p-0 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-float">
                    <div className="relative flex h-40 items-center justify-center bg-brand-very-light-blue/50">
                      <Home className="h-12 w-12 text-brand-blue/40" />
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-2.5 py-1 text-[11px] font-semibold text-text-secondary backdrop-blur">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            property.status?.toLowerCase() === "vacant"
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                        />
                        {property.status?.toLowerCase() === "vacant"
                          ? "Vacant"
                          : "Occupied"}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
                        {property.title}
                      </h3>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {property.estate}
                        {property.county ? `, ${property.county}` : ""}
                      </p>

                      <p className="mt-3 text-lg font-bold tracking-tight text-foreground">
                        {formatPrice(property.price).replace("KES", "KSh")}
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                          / month
                        </span>
                      </p>

                      <div className="mt-auto flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                        {property.bedrooms > 0 && (
                          <span>{property.bedrooms} bed</span>
                        )}
                        {property.bathrooms > 0 && (
                          <span>· {property.bathrooms} bath</span>
                        )}
                        {property.houseType && (
                          <span className="ml-auto capitalize">
                            {property.houseType}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Reveal>
              ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 flex justify-center">
            <Button asChild variant="outline" size="lg" className="h-11 gap-2 px-6">
              <Link to="/">
                View the full portfolio
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/*  CTA + Footer                                                               */
/* -------------------------------------------------------------------------- */

const CallToAction = () => (
  <section className="py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-brand-blue px-6 py-14 text-center shadow-float sm:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-2xl"
          />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to run your portfolio from one place?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/85">
              Create your workspace in under a minute and pick the role that
              matches how you work. Your team can be onboarded alongside you.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-11 gap-2 bg-white px-6 text-brand-blue hover:bg-white/90"
              >
                <Link to="/register">
                  Create your account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 border-white/40 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/login">Sign in instead</Link>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

const LandingFooter = () => (
  <footer className="border-t border-border bg-muted/30">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <Link to="/landing" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue text-white">
              <Building2 className="h-5 w-5" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-extrabold tracking-tight text-foreground">
                Davis &amp; Shirtliff
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Real Estate Manager
              </span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            A single workspace for listings, occupancy, rent roll, payments,
            and tenant operations.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Product
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href="#features"
                  className="transition-colors hover:text-foreground"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#workspaces"
                  className="transition-colors hover:text-foreground"
                >
                  Workspaces
                </a>
              </li>
              <li>
                <a
                  href="#listings"
                  className="transition-colors hover:text-foreground"
                >
                  Listings
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Account
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/login"
                  className="transition-colors hover:text-foreground"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="transition-colors hover:text-foreground"
                >
                  Create account
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="transition-colors hover:text-foreground"
                >
                  Browse properties
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                Privacy
              </li>
              <li className="flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5" />
                Billing
              </li>
              <li className="flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5" />
                Status
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
        <span>
          © {new Date().getFullYear()} Davis &amp; Shirtliff Real Estate
          Manager. All rights reserved.
        </span>
        <span>Built for modern property teams.</span>
      </div>
    </div>
  </footer>
);

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

const LandingPage = () => (
  <div className="min-h-screen bg-background text-foreground">
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-brand-blue focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
    >
      Skip to main content
    </a>

    <LandingHeader />

    <main id="main-content">
      <Hero />
      <StatsBand />
      <Features />
      <Workspaces />
      <HowItWorks />
      <FeaturedListings />
      <CallToAction />
    </main>

    <LandingFooter />
  </div>
);

export default LandingPage;
