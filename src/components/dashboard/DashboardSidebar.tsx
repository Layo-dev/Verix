import { Link, useLocation, useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Notification03Icon,
  Settings01Icon,
  CustomerSupportIcon,
  Logout02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface DashboardSidebarProps {
  contentOnly?: boolean;
  onNavigate?: () => void;
}

const accountItems = [
  { icon: UserIcon, label: "Profile", href: "/dashboard/profile" },
  { icon: Notification03Icon, label: "Notifications", href: "/dashboard/notifications", hasToggle: true },
  { icon: Settings01Icon, label: "Settings", href: "/dashboard/settings" },
];

const supportItems = [
  { icon: CustomerSupportIcon, label: "Help & Support", href: "/dashboard/support" },
];

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

  const MenuItem = ({
    item,
  }: {
    item: {
      icon: typeof UserIcon;
      label: string;
      href: string;
      hasToggle?: boolean;
    };
  }) => {
    const active = isActive(item.href);

    return (
      <div
        className={cn(
          "flex items-center gap-3 px-3 py-3 rounded-xl transition-colors",
          active
            ? "bg-accent text-white"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
        )}
      >
        <HugeiconsIcon
          icon={item.icon}
          size={20}
          className={cn("shrink-0", active ? "text-white" : "text-sidebar-foreground")}
        />
        <Link
          to={item.href}
          onClick={handleNavClick}
          className="flex-1 text-sm font-semibold"
        >
          {item.label}
        </Link>
        {item.hasToggle && (
          <Switch
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
            className="shrink-0"
          />
        )}
      </div>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Close button — only inside the mobile Sheet */}
      {/*{onNavigate && (
        <div className="flex justify-end px-4 pt-4 pb-2">
          <button
            aria-label="Close menu"
            onClick={handleNavClick}
            className="p-2 -mr-2 text-sidebar-foreground hover:text-white transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={22} />
          </button>
        </div>
      )}*/}

      <div className="flex-1 overflow-y-auto px-4 py-2">
        {/* Account */}
        <div className="mb-6">
          <p className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Account
          </p>
          <nav className="space-y-1">
            {accountItems.map((item) => (
              <MenuItem key={item.label} item={item} />
            ))}
          </nav>
        </div>

        {/* Support */}
        <div className="mb-6">
          <p className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Support
          </p>
          <nav className="space-y-1">
            {supportItems.map((item) => (
              <MenuItem key={item.label} item={item} />
            ))}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-6 pt-2 border-t border-sidebar-border">
        <div className="py-4">
          <p className="text-sm font-bold text-white">{displayName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Account ID</p>
          <p className="text-xs font-mono text-muted-foreground">{userId}</p>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent hover:text-white transition-colors"
        >
          <HugeiconsIcon icon={Logout02Icon} size={20} />
          <span className="text-sm font-semibold">Log out</span>
        </button>
      </div>
    </div>
  );

  if (contentOnly) {
    return <SidebarContent />;
  }

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-sidebar-border flex-shrink-0">
      <SidebarContent />
    </aside>
  );
};

export default DashboardSidebar;
