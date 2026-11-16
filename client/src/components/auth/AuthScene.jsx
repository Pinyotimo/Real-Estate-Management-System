import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Building2, Key, ShieldCheck, TrendingUp } from "lucide-react";

const DEFAULT_METRICS = [
  { Icon: ShieldCheck, value: "24/7", label: "Portal access" },
  { Icon: Key, value: "3", label: "Role workspaces" },
  { Icon: TrendingUp, value: "100%", label: "Responsive UI" },
];

/**
 * Shared 3D visual panel for the sign-in and registration screens.
 * The scene is pure CSS 3D (no canvas) so it stays cheap and accessible.
 */
const AuthScene = ({ badge, title, subtitle, metrics = DEFAULT_METRICS }) => (
  <section className="auth-scene relative flex min-h-[420px] flex-col justify-between overflow-hidden p-6 text-white sm:p-10 lg:min-h-[100vh] lg:p-14">
    <div className="relative z-10 max-w-xl">
      <span className="role-badge mb-6">
        <ShieldCheck className="h-3.5 w-3.5" />
        {badge}
      </span>

      <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">
        {subtitle}
      </p>
    </div>

    {/* Floating 3D cards */}
    <div className="pointer-events-none absolute right-6 top-10 hidden md:block lg:right-12 lg:top-16">
      <div className="glass-panel float-slow w-44 rounded-2xl p-4 text-foreground">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-very-light-blue text-brand-blue">
            <TrendingUp className="h-4 w-4" />
          </span>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Occupancy
          </p>
        </div>
        <p className="mt-2 text-2xl font-extrabold text-foreground">92%</p>
        <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
          +4.1% this month
        </p>
      </div>
    </div>

    <div className="pointer-events-none absolute bottom-24 right-16 hidden lg:block">
      <div className="glass-panel float-medium w-40 rounded-2xl p-4 text-foreground">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Rent collected
        </p>
        <p className="mt-1 text-xl font-extrabold text-foreground">KSh 1.2M</p>
        <div className="mt-3 flex h-10 items-end gap-1">
          {[40, 62, 48, 74, 58, 88].map((height, index) => (
            <span
              key={index}
              className="bar-grow flex-1 rounded-t-sm bg-brand-blue/30 last:bg-brand-blue"
              style={{
                "--bar-height": `${height}%`,
                "--bar-delay": `${200 + index * 60}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>

    <div className="relative z-10 mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
      {metrics.map(({ Icon, value, label }, index) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + index * 0.08, duration: 0.45 }}
          className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
        >
          <Icon className="mb-2 h-5 w-5 text-white" />
          <div className="text-lg font-bold text-white">{value}</div>
          <p className="text-xs text-white/60">{label}</p>
        </motion.div>
      ))}
    </div>

    <div className="pointer-events-none absolute bottom-10 left-6 hidden items-center gap-2 text-xs font-semibold text-white/70 sm:flex lg:left-14">
      <Building2 className="h-4 w-4" />
      Davis &amp; Shirtliff · Real Estate Manager
    </div>
  </section>
);

AuthScene.propTypes = {
  badge: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      Icon: PropTypes.elementType,
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ),
};

export default AuthScene;
