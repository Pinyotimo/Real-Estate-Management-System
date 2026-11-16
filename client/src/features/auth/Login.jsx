import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { AuthContext } from "../../context/AuthContext";
import AuthScene from "@/components/auth/AuthScene";
import ThemeToggle from "@/components/ThemeToggle";
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

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
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 sm:p-6">
        <Link
          to="/landing"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/80 px-3 py-2 text-xs font-semibold text-text-secondary backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-surface-soft hover:text-foreground hover:shadow-soft"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to site
        </Link>
        <ThemeToggle />
      </div>

      <div className="grid w-full flex-1 items-stretch lg:grid-cols-[1.05fr_1fr]">
        <div className="hidden lg:block">
          <AuthScene
            badge="Secure property operations"
            title="Manage listings, tenants, payments, and service requests."
            subtitle="A focused workspace for administrators, agents, landlords, and residents — with role-based access and a full audit trail."
          />
        </div>

        <div className="flex items-center justify-center p-4 pt-24 sm:p-8 lg:p-12 lg:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            <Link to="/landing" className="mb-8 inline-flex items-center gap-2.5 lg:hidden">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue text-white">
                <Building2 className="h-5 w-5" />
              </span>
              <span className="text-sm font-extrabold tracking-tight text-foreground">
                Davis &amp; Shirtliff
              </span>
            </Link>

            <Card className="card-shine rounded-2xl border-border bg-card shadow-float">
              <CardHeader className="space-y-1.5">
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Sign In
                </CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center gap-2 overflow-hidden rounded-xl border border-destructive/25 bg-destructive/10 p-3 text-xs text-destructive"
                  >
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
                      <span aria-hidden="true">×</span>
                    </Button>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        disabled={loading}
                        className="h-11 rounded-xl pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        disabled={loading}
                        className="h-11 rounded-xl pl-9 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-0 top-0 h-full w-10 rounded-xl text-muted-foreground hover:text-foreground"
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

                  <div className="space-y-2 pt-1">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="h-11 w-full gap-2 rounded-xl"
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

                <p className="pt-1 text-center text-xs text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-primary hover:underline"
                  >
                    Create one
                  </Link>
                </p>
              </CardContent>
            </Card>

            <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              Protected by hashed credentials and role-based access.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
