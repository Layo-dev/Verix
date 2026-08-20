import { useState } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Notification03Icon } from "@hugeicons/core-free-icons";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import DashboardSidebar from "../DashboardSidebar";

interface MobileHeaderProps {
  title?: string;
}

const MobileHeader = ({ title }: MobileHeaderProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 bg-background/95 backdrop-blur-md border-b border-border">
      <button
        aria-label="Open menu"
        className="p-2 -ml-2 text-foreground"
        onClick={() => setSidebarOpen(true)}
      >
        <HugeiconsIcon icon={Menu01Icon} size={22} />
      </button>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-[280px]">
          <DashboardSidebar contentOnly onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {title ? (
        <h1 className="text-base font-bold text-foreground">{title}</h1>
      ) : (
        <Link to="/dashboard" className="text-lg font-extrabold text-foreground">
          Verix<span className="text-accent">.</span>
        </Link>
      )}

      <button aria-label="Notifications" className="relative p-2 -mr-2 text-foreground">
        <HugeiconsIcon icon={Notification03Icon} size={22} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
      </button>
    </header>
  );
};

export default MobileHeader;
