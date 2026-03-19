import { useRef, useEffect } from "react";
import { Copy, MessageSquare, Inbox } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface SmsMessage {
  id: string;
  number_id: string;
  sender: string;
  body: string;
  otp_code: string | null;
  received_at: string;
}

interface SmsFeedProps {
  messages: SmsMessage[];
  selectedNumberId: string | null;
  phoneNumber?: string;
}

const extractOtp = (text: string): string | null => {
  const match = text.match(/\b(\d{4,8})\b/);
  return match ? match[1] : null;
};

const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
  toast({ title: "Copied!", description: `Code ${text} copied to clipboard` });
};

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const MessageCard = ({ message }: { message: SmsMessage }) => {
  const otp = message.otp_code || extractOtp(message.body);

  return (
    <div className="bg-card border border-border rounded-xl p-4 transition-all hover:shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5 text-accent" />
          </div>
          <span className="text-sm font-semibold text-foreground">{message.sender}</span>
        </div>
        <span className="text-xs text-muted-foreground">{formatTime(message.received_at)}</span>
      </div>

      <p className="text-sm text-foreground/80 leading-relaxed mb-3">{message.body}</p>

      {otp && (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-accent/5 border border-accent/20 rounded-lg px-3 py-2 flex items-center justify-between">
            <span className="font-mono text-lg font-bold text-accent tracking-widest">{otp}</span>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-accent hover:bg-accent/10"
              onClick={() => copyToClipboard(otp)}
            >
              <Copy className="w-3.5 h-3.5 mr-1" />
              <span className="text-xs">Copy</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const SmsFeed = ({ messages, selectedNumberId, phoneNumber }: SmsFeedProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!selectedNumberId) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-card rounded-xl border border-border">
        <Inbox className="w-12 h-12 text-muted-foreground/30 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">Select a number</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Choose a number to view its messages</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card rounded-xl border border-border">
      <div className="p-3 border-b border-border flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-accent" />
        <h2 className="text-sm font-semibold text-foreground">SMS Messages</h2>
        {phoneNumber && (
          <span className="text-xs text-muted-foreground ml-1">— {phoneNumber}</span>
        )}
        <span className="ml-auto text-xs text-muted-foreground">{messages.length} messages</span>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <MessageSquare className="w-8 h-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">Waiting for SMS...</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Messages will appear here in real-time</p>
              <div className="mt-4 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-accent/40 animate-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => <MessageCard key={msg.id} message={msg} />)
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default SmsFeed;
