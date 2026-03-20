import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Smartphone,
  Phone,
  Users,
  Wallet,
  Ticket,
  Bell,
  ChevronDown,
  Globe,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { icon: MessageSquare, label: "Receive SMS", href: "/dashboard" },
  { icon: Smartphone, label: "Mobile proxies", href: "/dashboard/proxies" },
  { icon: Phone, label: "Number rent", href: "/dashboard/rent" },
  { icon: Users, label: "SMS Inbox", href: "/dashboard/referral" },
];

const secondaryItems = [
  { icon: Wallet, label: "Refill balance", href: "/dashboard/refill" },
  { icon: Ticket, label: "Tickets", href: "/dashboard/tickets" },
];

interface DashboardSidebarProps {
  contentOnly?: boolean;
  onNavigate?: () => void;
}

const DashboardSidebar = ({ contentOnly, onNavigate }: DashboardSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const isActive = (href: string) => location.pathname === href;

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const userId = user?.id?.slice(0, 8) || "--------";

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  const handleNavClick = () => {
    onNavigate?.();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[hsl(var(--card))] text-card-foreground">
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link to="/" className="flex items-center gap-2" onClick={handleNavClick}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-3 h-3 bg-primary-foreground rounded-sm" />
          </div>
          <span className="text-xl font-bold text-foreground">Verix.</span>
        </Link>
      </div>

      {/* Balance */}
      <div className="px-6 pb-4">
        <div className="space-y-1">
          <p className="text-2xl font-bold text-foreground">$0</p>
          <p className="text-xs text-muted-foreground">Frozen balance: $0</p>
        </div>
        <Button className="w-full mt-3" variant="accent">
          Top up
        </Button>
      </div>

      {/* Main Menu */}
      <nav className="px-3 py-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            onClick={handleNavClick}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-[hsl(200,100%,50%)] text-white"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Separator */}
      <div className="mx-6 my-2 border-t border-border" />

      {/* Secondary Menu */}
      <nav className="px-3 py-2">
        {secondaryItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            onClick={handleNavClick}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-[hsl(200,100%,50%)] text-white"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Bell className="w-5 h-5" />
            <span className="text-sm font-medium">Notifications</span>
          </div>
          <Switch
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          />
        </div>
      </nav>

      {/* Show More */}
      <button className="flex items-center gap-2 px-6 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronDown className="w-4 h-4" />
        Show more
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Language Selector */}
      <div className="px-6 py-3">
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Globe className="w-5 h-5" />
          <span>🇬🇧 English</span>
          <ChevronDown className="w-4 h-4 ml-auto" />
        </button>
      </div>

      {/* User Profile */}
      <div className="p-6 pt-2 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{displayName}</p>
            <p className="text-xs text-muted-foreground">ID: {userId}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  if (contentOnly) {
    return <SidebarContent />;
  }

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border flex-shrink-0">
      <SidebarContent />
    </aside>
  );
};

export default DashboardSidebar;
