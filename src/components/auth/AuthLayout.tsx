import { ReactNode } from "react";
import VerixLogo from "@/assets/verixsms-logo.svg";


const Wordmark = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center ${className}`}>
    <img src={VerixLogo} alt="Verix logo" className="h-12 w-auto block invert" />
    <span className="text-xl font-extrabold text-foreground leading-none -ml-6 -mb-2">
      erix.
    </span>
  </div>
);

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-background text-foreground lg:grid lg:grid-cols-[45%_55%]">
      {/* Brand panel */}
      <aside className="auth-brand-panel relative hidden lg:flex flex-col justify-between overflow-hidden p-12 border-r border-border">
        <Wordmark />

        <div className="max-w-md space-y-6">
          <h2 className="text-4xl xl:text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground">
            Receive SMS.
            <br />
            Build Your Digital
            <br />
            Workflow.
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Fast virtual numbers. Reliable SMS verification. Built for modern
            digital businesses.
          </p>
          <div className="h-1 w-16 rounded-full bg-accent" />
        </div>

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} VerixSMS
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex min-h-screen flex-col items-center justify-center px-5 py-10 sm:px-8 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center gap-2 lg:hidden">
            <Wordmark />
            <p className="text-sm text-muted-foreground text-center">
              Fast virtual numbers. Reliable SMS verification.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
};

export default AuthLayout;
