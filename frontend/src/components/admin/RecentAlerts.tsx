"use client";

import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: string;
  status: string;
  created_at: string;
}

interface RecentAlertsProps {
  alerts: Alert[];
}

function getSeverityStyle(severity: string) {
  switch (severity.toUpperCase()) {
    case "CRITICAL":
      return {
        icon: XCircle,
        container: "bg-red-50",
        iconColor: "text-red-600",
      };

    case "HIGH":
      return {
        icon: AlertTriangle,
        container: "bg-orange-50",
        iconColor: "text-orange-600",
      };

    case "MEDIUM":
      return {
        icon: AlertTriangle,
        container: "bg-yellow-50",
        iconColor: "text-yellow-600",
      };

    default:
      return {
        icon: Info,
        container: "bg-blue-50",
        iconColor: "text-blue-600",
      };
  }
}

export default function RecentAlerts({ alerts }: RecentAlertsProps) {
  if (!alerts.length) {
    return (
      <div className="mt-6 text-center py-16">
        <CheckCircle size={32} className="mx-auto text-green-500" />

        <p className="mt-3 text-sm text-slate-400">No recent alerts</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      {alerts.slice(0, 5).map((alert) => {
        const style = getSeverityStyle(alert.severity);

        const Icon = style.icon;

        return (
          <div key={alert.id} className="flex items-start gap-3">
            <div
              className={`
                w-9 h-9 shrink-0 rounded-lg
                flex items-center justify-center
                ${style.container}
              `}
            >
              <Icon size={18} className={style.iconColor} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-medium text-slate-800 truncate">
                  {alert.title}
                </h3>

                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(alert.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {alert.message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
