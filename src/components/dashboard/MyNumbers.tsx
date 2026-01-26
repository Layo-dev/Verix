import { Info } from "lucide-react";

interface MyNumbersProps {
  orders: Array<{
    id: string;
    number: string;
    service: string;
    expiresAt: Date;
  }>;
}

const MyNumbers = ({ orders }: MyNumbersProps) => {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">My numbers</h3>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        {orders.length === 0 ? (
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Info className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No operations</p>
          </div>
        ) : (
          <div className="w-full space-y-2">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-3 rounded-lg bg-muted/50 border border-border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {order.number}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.service}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Expires:{" "}
                    {new Date(order.expiresAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNumbers;
