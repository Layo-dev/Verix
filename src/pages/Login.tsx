import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import AuthInput from "@/components/auth/AuthInput";
import SupportButton from "@/components/auth/SupportButton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import VerixLogo from "@/assets/verixsms-logo.svg";

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
        // Check offline first
        if (!navigator.onLine) {
          return "No internet connection. Please check your network.";
        }
    
        // Match specific errors
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
    //if (error) {
    //  toast.error(
    //    error.message === "Invalid login credentials"
    //      ? "Invalid email or password"
    //      : error.message
    //  );
    //  setIsLoading(false);
    //  return;
    //}

    toast.success("Welcome back!");
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="inline-flex items-center justify-center gap-2">
          <img src={VerixLogo} alt="Verix logo" className="h-16 w-auto block" />
          <span className="text-2xl font-bold text-foreground leading-none -ml-6 -mb-3">erix.</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-foreground text-center">Login</h1>

        {/* Social Login */}
        <SocialLoginButtons />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            type="email"
            placeholder="Email or login"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <AuthInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-accent hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12"
            variant="accent"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
          </Button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-muted-foreground">
          New user?{" "}
          <Link to="/signup" className="text-accent font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      <SupportButton />
    </div>
  );
};

export default Login;
