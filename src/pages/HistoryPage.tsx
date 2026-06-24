import { useEffect, useMemo, useState } from "react";
import { Menu, Search, History as HistoryIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ExpiredNumber {
  id: string;
  phone_number: string;
  country_code: string;
  country_flag: string;
  service_name: string;
  price_usd: number;
  otp_status: string | null;
  expires_at: string;
  created_at: string;
}

type DateRange = "7d" | "30d" | "all";
type StatusFilter = "all" | "received" | "no_code";

const DATE_TABS: { id: DateRange; label: string }[] = [
  { id: "7d", label: "Last 7 Days" },
  { id: "30d", label: "Last 30 Days" },
  { id: "all", label: "All Time" },
];

const isReceived = (s: string | null) => (s || "").toLowerCase() === "received";

const HistoryPage = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ExpiredNumber[]>([]);

  const [range, setRange] = useState<DateRange>("7d");
  const [numberQuery, setNumberQuery] = useState("");
  const [serviceQuery, setServiceQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("purchased_numbers")
        .select(
          "id, phone_number, country_code, country_flag, service_name, price_usd, otp_status, expires_at, created_at"
        )
        .eq("user_id", user.id)
        .eq("status", "expired")
        .order("expires_at", { ascending: false });
      if (!cancelled) {
        setRows((data ?? []) as ExpiredNumber[]);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const filtered = useMemo(() => {
    const now = Date.now();
    const cutoff =
      range === "7d"
        ? now - 7 * 86400000
        : range === "30d"
        ? now - 30 * 86400000
        : 0;

    return rows.filter((r) => {
      if (cutoff && new Date(r.expires_at).getTime() < cutoff) return false;
      if (
        numberQuery &&
        !r.phone_number.toLowerCase().includes(numberQuery.toLowerCase())
      )
        return false;
      if (
        serviceQuery &&
        !r.service_name.toLowerCase().includes(serviceQuery.toLowerCase())
      )
        return false;
      if (status === "received" && !isReceived(r.otp_status)) return false;
      if (status === "no_code" && isReceived(r.otp_status)) return false;
      return true;
    });
  }, [rows, range, numberQuery, serviceQuery, status]);

  const totalPurchases = filtered.length;
  const totalSpent = filtered.reduce((sum, r) => sum + Number(r.price_usd || 0), 0);

  const StatusPill = ({ s }: { s: string | null }) => {
    const received = isReceived(s);
    return (
      <span
        className={cn(
          "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium",
          received
            ? "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]"
            : "bg-destructive/10 text-destructive"
        )}
      >
        {received ? "Received" : "No Code"}
      </span>
    );
  };

  const content = (
    <div className="space-y-4 lg:space-y-6">
      {/* Date tabs */}
      <div className="bg-card border border-border rounded-xl p-1 flex gap-1 w-full overflow-x-auto">
        {DATE_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setRange(t.id)}
            className={cn(
              "flex-1 min-w-fit px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
              range === t.id
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search number"
            value={numberQuery}
            onChange={(e) => setNumberQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search service"
            value={serviceQuery}
            onChange={(e) => setServiceQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="no_code">No Code</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Total Purchases</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalPurchases}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Total Spent</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            ${totalSpent.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Table / list */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <HistoryIcon className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-foreground">No expired numbers</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your expired numbers will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Number</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <span className="inline-flex items-center gap-2">
                          <span className="text-lg leading-none">{r.country_flag}</span>
                          <span className="text-xs text-muted-foreground uppercase">
                            {r.country_code}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{r.service_name}</TableCell>
                      <TableCell className="font-mono text-sm">{r.phone_number}</TableCell>
                      <TableCell>${Number(r.price_usd || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <StatusPill s={r.otp_status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-border">
              {filtered.map((r) => (
                <div key={r.id} className="p-3 flex items-center gap-3">
                  <span className="text-2xl">{r.country_flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm text-foreground truncate">
                      {r.phone_number}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {r.service_name}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-semibold text-foreground">
                      ${Number(r.price_usd || 0).toFixed(2)}
                    </span>
                    <StatusPill s={r.otp_status} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-3">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-r border-border">
              <DashboardSidebar contentOnly onNavigate={() => setSidebarOpen(false)} />
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-bold text-foreground flex-1 text-center">
            History
          </h1>
          <div className="w-8" />
        </header>
        <main className="flex-1 p-4">{content}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      <main className="flex-1 p-4 lg:p-8 lg:pl-4 overflow-x-hidden">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">History</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Expired numbers from your account.
          </p>
        </div>
        {content}
      </main>
    </div>
  );
};

export default HistoryPage;
