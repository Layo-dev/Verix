import { useState } from "react";
import { Menu } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InformationCircleIcon,
  Clock01Icon,
  PencilEdit02Icon,
  ShieldEnergyIcon,
} from "@hugeicons/core-free-icons";
import { SiWhatsapp, SiTelegram, SiGmail } from "react-icons/si";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import supportIllustration from "@/assets/support-illustration.png";

const channels = [
  {
    label: "WhatsApp",
    href: "https://wa.me/",
    icon: SiWhatsapp,
    iconClass: "text-[#25D366]",
    ringClass: "bg-[#25D366]/15",
  },
  {
    label: "Telegram",
    href: "https://t.me/verixsms",
    icon: SiTelegram,
    iconClass: "text-[#229ED9]",
    ringClass: "bg-[#229ED9]/15",
  },
  {
    label: "Email",
    href: "mailto:support@verixsms.com",
    icon: SiGmail,
    iconClass: "text-[#EA4335]",
    ringClass: "bg-[#EA4335]/15",
  },
];

const tips = [
  {
    icon: Clock01Icon,
    title: "Response Time",
    text: "Our team typically replies within a few minutes to a few hours depending on volume.",
  },
  {
    icon: PencilEdit02Icon,
    title: "What to Include",
    text: "Share your registered email, order details, and a clear description of your issue to help us resolve it faster.",
  },
  {
    icon: ShieldEnergyIcon,
    title: "Safe & Secure",
    text: "Never share your password with anyone, including our support team. We will never ask for it.",
  },
];

const SupportContent = () => (
  <div className="mx-auto w-full max-w-2xl space-y-8">
    {/* Header */}
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 space-y-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Support Center
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Need help? Our team is ready to assist you. Choose your preferred
          channel below.
        </p>
      </div>
      <img
        src={supportIllustration}
        alt="Verix support"
        width={768}
        height={768}
        loading="lazy"
        className="h-24 w-24 shrink-0 object-contain sm:h-28 sm:w-28"
      />
    </div>

    {/* Notice */}
    <div className="flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4">
      <HugeiconsIcon
        icon={InformationCircleIcon}
        size={20}
        className="mt-0.5 shrink-0 text-destructive"
      />
      <p className="text-sm leading-relaxed text-destructive">
        Please use one channel only per issue. Do not send the same message
        across WhatsApp, Telegram, and email simultaneously.
      </p>
    </div>

    {/* Channels */}
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-foreground">Contact channels</h2>
        <span className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--success))]/12 px-3 py-1.5 text-xs font-semibold text-[hsl(var(--success))]">
          <span className="h-2 w-2 rounded-full bg-[hsl(var(--success))]" />
          Fast response usually in minutes
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {channels.map((channel) => {
          const Icon = channel.icon;
          return (
            <a
              key={channel.label}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card px-3 py-6 text-center transition-colors hover:border-accent/60 hover:bg-surface"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full ${channel.ringClass}`}
              >
                <Icon className={`h-7 w-7 ${channel.iconClass}`} />
              </span>
              <span className="text-sm font-semibold text-foreground">
                {channel.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>

    {/* Tips */}
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Before you reach out</h2>
      <div className="space-y-3">
        {tips.map((tip) => (
          <div
            key={tip.title}
            className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15">
              <HugeiconsIcon icon={tip.icon} size={20} className="text-accent" />
            </span>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">{tip.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {tip.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SupportPage = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-4">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="-ml-2 p-2 text-foreground"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 border-r border-border p-0">
              <DashboardSidebar contentOnly onNavigate={() => setSidebarOpen(false)} />
            </SheetContent>
          </Sheet>
          <h1 className="flex-1 text-center text-lg font-bold text-foreground">
            Support
          </h1>
          <div className="w-8" />
        </header>
        <main className="flex-1 p-4">
          <SupportContent />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-x-hidden p-4 lg:p-8">
        <SupportContent />
      </main>
    </div>
  );
};

export default SupportPage;
