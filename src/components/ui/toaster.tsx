import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { AlertTriangle, Check, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const variantStyles = {
  default: {
    icon: Info,
    badgeClassName: "bg-background text-[hsl(var(--toast-info-icon))]",
  },
  success: {
    icon: Check,
    badgeClassName: "bg-background text-[hsl(var(--toast-success-icon))]",
  },
  warning: {
    icon: AlertTriangle,
    badgeClassName: "bg-background text-[hsl(var(--toast-warning-icon))]",
  },
  destructive: {
    icon: XCircle,
    badgeClassName: "bg-background text-[hsl(var(--toast-error-icon))]",
  },
} as const;

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant = "default", ...props }) {
        const tone = variantStyles[variant ?? "default"] ?? variantStyles.default;
        const Icon = tone.icon;

        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex w-full items-start gap-3 pr-2">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-sm ring-1 ring-border/40",
                  tone.badgeClassName,
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={2.25} />
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <div className="grid gap-1">
                  {title && <ToastTitle>{title}</ToastTitle>}
                  {description && <ToastDescription>{description}</ToastDescription>}
                </div>
                {action}
              </div>
            </div>
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
