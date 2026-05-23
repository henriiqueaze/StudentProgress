import type { StudentStatus } from "./types";

export const STATUS_LABELS: Record<StudentStatus, string> = {
  APPROVED: "Aprovado",
  FAILED: "Reprovado",
  RECOVERY: "Recuperação",
};

export const STATUS_BADGE_CLASSES: Record<StudentStatus, string> = {
  APPROVED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  FAILED: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  RECOVERY: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
};
