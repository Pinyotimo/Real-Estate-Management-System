import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  ShieldCheck,
  Clock,
  Users,
  Smartphone,
  AlertCircle,
  X,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  Building2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/ThemeToggle";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target after successful login
  const from = location.state?.from?.pathname || "/";

  const handleLoginSubmit = async (loginEmail, loginPassword) => {
    setError("");
    setLoading(true);

    try {
      const result = await login(loginEmail, loginPassword);
      if (result?.success) {
        navigate(from, { replace: true });
      } else {
        setError(
          result?.error || "Invalid email or password. Please try again."
        );
      }
    } catch (err) {
      setError(
        err?.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    handleLoginSubmit(email, password);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Top bar: return to site + appearance control */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 sm:p-6">
        <Link
          to="/landing"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/80 px-3 py-2 text-xs font-semibold text-text-secondary backdrop-blur transition-colors hover:bg-surface-soft hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to site
        </Link>
        <ThemeToggle />
      </div>

      <div className="grid w-full flex-1 items-center lg:grid-cols-2">
        {/* Hero Section */}
        <div className="auth-hero hidden h-full lg:flex">
          <div className="relative z-10 space-y-6 max-w-lg">
            <Badge
              variant="secondary"
              className="w-fit gap-1.5 border border-white/15 bg-white/10 px-3 py-1 text-white"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Secure property operations</span>
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Manage listings, tenants, payments, and service requests.
            </h1>
            <p className="text-sm leading-relaxed text-white/75">
              A focused workspace for administrators, agents, landlords, and
              residents with Davis &amp; Shirtliff inspired visual standards.
            </p>
          </div>

          <div
            className="relative z-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8"
            aria-label="Platform highlights"
          >
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <Clock className="mb-2 h-5 w-5 text-white" />
              <div className="text-lg font-bold text-white">24/7</div>
              <p className="text-xs text-white/60">Portal access</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <Users className="mb-2 h-5 w-5 text-white" />
              <div className="text-lg font-bold text-white">3</div>
              <p className="text-xs text-white/60">Role workspaces</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <Smartphone className="mb-2 h-5 w-5 text-white" />
              <div className="text-lg font-bold text-white">100%</div>
              <p className="text-xs text-white/60">Responsive UI</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex items-center justify-center p-4 pt-24 sm:p-8 lg:p-12 lg:pt-12">
          <div className="w-full max-w-md">
            <Link
              to="/landing"
              className="mb-8 inline-flex items-center gap-2.5 lg:hidden"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue text-white">
                <Building2 className="h-5 w-5" />
              </span>
              <span className="text-sm font-extrabold tracking-tight text-foreground">
                Davis &amp; Shirtliff
              </span>
            </Link>

            <Card className="rounded-2xl border-border bg-card shadow-float">
              <CardHeader className="space-y-1.5">
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Sign In
                </CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Error Banner */}
                {error && (
                  <div className="flex items-center gap-2 rounded-xl border border-destructive/25 bg-destructive/10 p-3 text-xs text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{error}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setError("")}
                      className="h-5 w-5 p-0 text-destructive hover:bg-transparent hover:text-destructive"
                      aria-label="Dismiss error"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      disabled={loading}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        disabled={loading}
                        className="h-10 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" disabled={loading} />
                      <Label
                        htmlFor="remember"
                        className="cursor-pointer text-xs font-normal text-muted-foreground"
                      >
                        Remember me
                      </Label>
                    </div>
                    <Link
                      to="/login"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="h-10 w-full gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Signing in…</span>
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </div>
                </form>

                <p className="pt-2 text-center text-xs text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-primary hover:underline"
                  >
                    Create one
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
