import type { Alert } from "../types";

type AlertBannerProps = {
  alert: Alert;
};

export function AlertBanner({ alert }: AlertBannerProps) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${
        alert.type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : alert.type === "info"
            ? "border-sky-200 bg-sky-50 text-sky-800"
            : "border-rose-200 bg-rose-50 text-rose-800"
      }`}
      role="status"
    >
      {alert.message}
    </div>
  );
}
