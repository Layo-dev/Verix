import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, MailValidation01Icon } from "@hugeicons/core-free-icons";

const RESEND_COOLDOWN = 60;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const sendResetLink = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setSent(true);
    setCooldown(RESEND_COOLDOWN);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendResetLink();
  };

  const handleResend = async () => {
    if (cooldown > 0 || loading) return;
    await sendResetLink();
  };

  return (
    <AuthLayout>
      {sent ? (
        <div className="space-y-7">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <HugeiconsIcon icon={MailValidation01Icon} size={28} />
          </div>

          <header className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Check your email
            </h1>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              If an account exists for{" "}
              <span className="font-semibold text-foreground">
                {email || "your email"}
              </span>
              , we&apos;ll send a link to reset your password.
            </p>
          </header>

          <div className="space-y-3">
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Button
              type="button"
              variant="accent"
              className="h-12 w-full text-base font-bold"
              onClick={handleResend}
              disabled={cooldown > 0 || loading}
            >
              {loading
                ? "Sending..."
                : cooldown > 0
                  ? `Resend link in ${cooldown}s`
                  : "Resend link"}
            </Button>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
              Back to login
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-7">
          <header className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Forgot password?
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter the email linked to your Verix account and we&apos;ll send you
              a reset link.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          <Button
            type="submit"
            variant="accent"
            disabled={loading}
            className="h-12 w-full text-base font-bold"
          >
            {loading ? "Sending..." : "Send reset link"}
          </Button>
          </form>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
            Back to login
          </Link>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
