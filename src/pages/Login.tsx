import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const getErrorMessage = (err: any) => {
        if (!navigator.onLine) {
          return "No internet connection. Please check your network.";
        }
        switch (err.message) {
          case "Invalid login credentials":
            return "Invalid email or password";
          case "Failed to fetch":
            return "Could not reach the server. Please try again.";
          case "Timeout":
            return "Request took too long. Please try again.";
          default:
            return err.message || "An error occurred. Please try again.";
        }
      };

      toast.error(getErrorMessage(error));
      setIsLoading(false);
      return;
    }

    toast.success("Welcome back!");
    navigate("/dashboard", { replace: true });
  };

  return (
    <AuthLayout>
      <div className="space-y-7">
        <header className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Login
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back to VerixSMS. Access your account and continue.
          </p>
        </header>

        <SocialLoginButtons />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-card px-3 text-muted-foreground lg:bg-background">
              Or
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput
            label="Email or login"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <div className="space-y-2">
            <AuthInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-accent hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-bold"
            variant="accent"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-accent font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
