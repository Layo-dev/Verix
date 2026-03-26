import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import NumberList from "@/components/dashboard/NumberList";
import SmsFeed from "@/components/dashboard/SmsFeed";
import { Settings, ArrowLeft, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface PurchasedNumber {
  id: string;
  phone_number: string;
  country_code: string;
  country_flag: string;
  service_name: string;
  status: "active" | "expiring" | "expired";
  expires_at: string;
  created_at: string;
}

interface SmsMessage {
  id: string;
  number_id: string;
  sender: string;
  body: string;
  otp_code: string | null;
  received_at: string;
}

const SmsInboxPage = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [selectedNumberId, setSelectedNumberId] = useState<string | null>(null);
  const [numbers, setNumbers] = useState<PurchasedNumber[]>([]);
  const [messages, setMessages] = useState<SmsMessage[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch purchased numbers
  useEffect(() => {
    if (!user) return;
    const fetchNumbers = async () => {
      const { data } = await supabase
        .from("purchased_numbers")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setNumbers(data as unknown as PurchasedNumber[]);
    };
    fetchNumbers();
  }, [user]);

  // Fetch messages for selected number
  useEffect(() => {
    if (!selectedNumberId) {
      setMessages([]);
      return;
    }
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("sms_messages")
        .select("*")
        .eq("number_id", selectedNumberId)
        .order("received_at", { ascending: true });
      if (data) setMessages(data as unknown as SmsMessage[]);
    };
    fetchMessages();
  }, [selectedNumberId]);

  // Realtime subscription for new messages
  useEffect(() => {
    if (!selectedNumberId) return;

    const channel = supabase
      .channel(`sms-feed-${selectedNumberId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sms_messages",
          filter: `number_id=eq.${selectedNumberId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as unknown as SmsMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedNumberId]);

  const selectedNumber = numbers.find((n) => n.id === selectedNumberId);

  // Mobile layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-3">
          {selectedNumberId ? (
            <button onClick={() => setSelectedNumberId(null)} className="p-1 text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-r border-border">
                <DashboardSidebar contentOnly onNavigate={() => setSidebarOpen(false)} />
              </SheetContent>
            </Sheet>
          )}
          <h1 className="text-lg font-bold text-foreground flex-1 text-center">
            {selectedNumberId ? selectedNumber?.phone_number || "Messages" : "SMS Inbox"}
          </h1>
          <button className="p-1 text-muted-foreground">
            <Settings className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1">
          {selectedNumberId ? (
            <div className="h-[calc(100vh-56px)]">
              <SmsFeed
                messages={messages}
                selectedNumberId={selectedNumberId}
                phoneNumber={selectedNumber?.phone_number}
              />
            </div>
          ) : (
            <div className="h-[calc(100vh-56px)]">
              <NumberList
                numbers={numbers}
                selectedNumberId={selectedNumberId}
                onSelectNumber={setSelectedNumberId}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />

      <main className="flex-1 p-4 lg:p-8 lg:pl-4 overflow-x-hidden">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">SMS Inbox</h1>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 h-[600px]">
          <div className="lg:col-span-1 h-full">
            <NumberList
              numbers={numbers}
              selectedNumberId={selectedNumberId}
              onSelectNumber={setSelectedNumberId}
            />
          </div>
          <div className="lg:col-span-2 h-full">
            <SmsFeed
              messages={messages}
              selectedNumberId={selectedNumberId}
              phoneNumber={selectedNumber?.phone_number}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SmsInboxPage;
