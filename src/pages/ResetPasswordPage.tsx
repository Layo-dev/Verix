import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  LockPasswordIcon,
  CheckmarkCircle02Icon,
  ArrowLeft02Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";

import { supabase } from "@/integrations/supabase/client";

const SESSION_DETECTION_TIMEOUT = 5000;

const passwordStrengthHint = (password: string): string => {
  if (!password) return "";
  const hasLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  if (hasLength && hasNumber && hasSymbol) return "Strong password.";
  if (hasLength && (hasNumber || hasSymbol)) return "Good — add a number and symbol to make it stronger.";
  return "Use at least 8 characters with a number and a symbol.";
};

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
        setChecking(false);
      }
    });

    const timeout = setTimeout(() => {
      setChecking((current) => {
        if (current) setReady(false);
        return false;
      });
    }, SESSION_DETECTION_TIMEOUT);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
    redirectTimer.current = setTimeout(() => navigate("/login"), 3000);
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="space-y-7">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              size={28}
            />
          </div>

          <header className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Password updated
            </h1>

            <p className="text-sm text-muted-foreground" aria-live="polite">
              Your Verix password has been successfully changed. Redirecting you
              to login…
            </p>
          </header>

          <Button
            type="button"
            variant="accent"
            className="h-12 w-full text-base font-bold"
            onClick={() => navigate("/login")}
          >
            Continue to login
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-7">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
          <HugeiconsIcon
            icon={LockPasswordIcon}
            size={28}
          />
        </div>

        <header className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Reset your password
          </h1>

          <p className="text-sm text-muted-foreground">
            Create a new password for your Verix account.
          </p>
        </header>

        {checking ? (
          <div
            className="flex items-center gap-3 text-sm text-muted-foreground"
            aria-live="polite"
          >
            <HugeiconsIcon
              icon={Loading03Icon}
              size={18}
              className="animate-spin"
            />
            Verifying your recovery link…
          </div>
        ) : !ready ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              This password reset link is invalid or has expired.
            </p>

            <Link
              to="/forgot-password"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <HugeiconsIcon
                icon={ArrowLeft02Icon}
                size={18}
              />
              Request a new link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              label="New password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              helperText={passwordStrengthHint(password)}
              required
            />

            <AuthInput
              label="Confirm password"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
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
              {loading ? "Updating..." : "Update password"}
            </Button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
