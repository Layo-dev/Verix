import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ArrowLeft } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import AuthInput from "@/components/auth/AuthInput";
import SupportButton from "@/components/auth/SupportButton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import VerixLogo from "@/assets/verixsms-logo.svg";

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, 1);
  return `${visible}***@${domain}`;
}

const COUNTDOWN_SECONDS = 60;

const Signup = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<{ confirmPassword?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [countdown]);

  const sendOtp = useCallback(async () => {
    setIsLoading(true);
    setOtpError("");
    try {
      const { data, error } = await supabase.functions.invoke("send-otp", {
        body: { email },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setCountdown(COUNTDOWN_SECONDS);
      return true;
    } catch (e: any) {
      toast.error(e.message || "Failed to send verification code");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }
    setErrors({});
    const sent = await sendOtp();
    if (sent) setStep(2);
  };

  const handleVerifyOtp = useCallback(
    async (code: string) => {
      setIsLoading(true);
      setOtpError("");
      try {
        const { data, error } = await supabase.functions.invoke("verify-otp", {
          body: { email, otp: code },
        });
        if (error) throw error;
        if (!data?.valid) {
          setOtpError(data?.error || "Invalid code");
          setIsLoading(false);
          return;
        }

        // OTP verified — create account
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (signUpError) {
          toast.error(signUpError.message);
          setIsLoading(false);
          return;
        }
        toast.success("Account created successfully!");
      } catch (e: any) {
        setOtpError(e.message || "Verification failed");
      } finally {
        setIsLoading(false);
      }
    },
    [email, password]
  );

  const handleOtpChange = (value: string) => {
    setOtpValue(value);
    setOtpError("");
    if (value.length === 6) {
      handleVerifyOtp(value);
    }
  };

  const handleResend = async () => {
    setOtpValue("");
    await sendOtp();
  };

  const formatCountdown = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <img src={VerixLogo} alt="Verix logo" className="h-16 w-auto block" />
          <span className="text-2xl font-bold text-foreground leading-none -ml-8 -mb-3">erix.</span>
        </div>

        {step === 1 ? (
          <>
            {/* Heading */}
            <h1 className="text-3xl font-bold text-foreground text-center">Sign Up</h1>

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

            {/* Signup Form */}
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <AuthInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                helperText="We'll send a verification code"
                required
              />
              <AuthInput
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <AuthInput
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                required
              />

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="mt-0.5"
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground leading-snug">
                  By continuing, you agree to our{" "}
                  <Link to="/terms" className="text-accent hover:underline">Terms of Service</Link>,{" "}
                  <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>, and{" "}
                  <Link to="/refund" className="text-accent hover:underline">Refund Policy</Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full h-12"
                variant="accent"
                disabled={!agreedToTerms || isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-accent font-medium hover:underline">Login</Link>
            </p>
          </>
        ) : (
          <>
            {/* Step 2: OTP Verification */}
            <div className="space-y-6">
              <button
                type="button"
                onClick={() => { setStep(1); setOtpValue(""); setOtpError(""); }}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Verify your email</h1>
                <p className="text-sm text-muted-foreground">
                  Code sent to <span className="font-medium text-foreground">{maskEmail(email)}</span>
                </p>
              </div>

              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otpValue} onChange={handleOtpChange} disabled={isLoading}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {otpError && (
                <p className="text-center text-sm text-destructive">{otpError}</p>
              )}

              {isLoading && (
                <div className="flex justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              )}

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Resend in {formatCountdown(countdown)}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isLoading}
                    className="text-sm text-accent font-medium hover:underline disabled:opacity-50"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <SupportButton />
    </div>
  );
};

export default Signup;
