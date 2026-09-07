import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, MailValidation01Icon } from "@hugeicons/core-free-icons";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI only for now — no request is sent.
    setSent(true);
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
            <p className="text-sm text-muted-foreground">
              If an account exists for{" "}
              <span className="font-semibold text-foreground">
                {email || "your email"}
              </span>
              , we&apos;ll send a link to reset your password.
            </p>
          </header>

          <div className="space-y-3">
            <Button
              type="button"
              variant="accent"
              className="h-12 w-full text-base font-bold"
              onClick={() => setSent(false)}
            >
              Resend link
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

            <Button
              type="submit"
              variant="accent"
              className="h-12 w-full text-base font-bold"
            >
              Send reset link
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
