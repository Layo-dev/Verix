import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: MessageSquare, label: "Buy Number", href: "/dashboard", active: true },
  { icon: Smartphone, label: "Mobile proxies", href: "/dashboard/proxies" },
  { icon: Phone, label: "Active Numbers", href: "/dashboard/rent" },
  { icon: Users, label: "SMS Inbox", href: "/dashboard/referral" },
];

const secondaryItems = [
  { icon: Wallet, label: "Refill balance", href: "/dashboard/refill" },
  { icon: Ticket, label: "Tickets", href: "/dashboard/tickets" },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => location.pathname === href;

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link to="/" className="flex items-center gap-2">
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
            <p className="text-sm font-medium text-foreground">John Doe</p>
            <p className="text-xs text-muted-foreground">ID: 12345678</p>
          </div>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-background rounded-lg border border-border shadow-md lg:hidden"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex flex-col z-40 transition-transform duration-300 lg:translate-x-0 lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default DashboardSidebar;
