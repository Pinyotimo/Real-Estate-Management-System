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
  Briefcase,
  KeyRound,
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

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    handleLoginSubmit(demoEmail, demoPassword);
  };

  return (
    <div className="container relative min-h-[calc(100vh-4rem)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 my-6">
      {/* Hero Section */}
      <div className="relative flex-col justify-between p-8 lg:p-12 text-foreground hidden lg:flex h-full border-r border-border bg-muted/30 rounded-2xl lg:rounded-r-none">
        <div className="space-y-6 max-w-lg">
          <Badge variant="secondary" className="gap-1.5 py-1 px-3 w-fit">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Secure property operations</span>
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Manage listings, tenants, payments, and service requests.
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            A focused workspace for administrators, agents, landlords, and
            residents with Davis &amp; Shirtliff inspired visual standards.
          </p>
        </div>

        <div
          className="grid grid-cols-3 gap-4 pt-8 border-t border-border"
          aria-label="Platform highlights"
        >
          <Card className="p-4 bg-card/60 border-border shadow-none">
            <Clock className="w-5 h-5 text-primary mb-2" />
            <div className="text-lg font-bold text-foreground">24/7</div>
            <p className="text-xs text-muted-foreground">Portal access</p>
          </Card>

          <Card className="p-4 bg-card/60 border-border shadow-none">
            <Users className="w-5 h-5 text-primary mb-2" />
            <div className="text-lg font-bold text-foreground">3</div>
            <p className="text-xs text-muted-foreground">Role workspaces</p>
          </Card>

          <Card className="p-4 bg-card/60 border-border shadow-none">
            <Smartphone className="w-5 h-5 text-primary mb-2" />
            <div className="text-lg font-bold text-foreground">100%</div>
            <p className="text-xs text-muted-foreground">Responsive UI</p>
          </Card>
        </div>
      </div>

      {/* Form Section */}
      <div className="p-4 lg:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md border-border bg-card shadow-xs">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Banner */}
            {error && (
              <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="flex-1">{error}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setError("")}
                  className="h-5 w-5 p-0 hover:bg-transparent text-destructive hover:text-destructive"
                  aria-label="Dismiss error"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}

            {/* Demo Login Panel */}
            <div className="p-3.5 rounded-xl bg-muted/50 border border-border space-y-2">
              <p className="text-xs font-semibold text-foreground">
                Quick Demo Login
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => handleDemoLogin("admin@test.com", "password123")}
                  disabled={loading}
                  className="h-8 text-xs gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin("agent@test.com", "password123")}
                  disabled={loading}
                  className="h-8 text-xs gap-1.5"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Agent
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDemoLogin("tenant@test.com", "password123")}
                  disabled={loading}
                  className="h-8 text-xs gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Tenant
                </Button>
              </div>
            </div>

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
                    className="pr-10"
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
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" disabled={loading} />
                  <Label
                    htmlFor="remember"
                    className="text-xs text-muted-foreground cursor-pointer font-normal"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/login"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing in…</span>
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  className="w-full gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>
            </form>

            <p className="text-center text-xs text-muted-foreground pt-2">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:underline font-medium"
              >
                Create one
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;