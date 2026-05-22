export function parseNotes(notesInput: string): number[] {
  if (!notesInput.trim()) {
    return [];
  }

  return notesInput
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => !Number.isNaN(value));
}

export function collectNotes(noteValues: string[]): number[] {
  return noteValues
    .map((value) => Number(value.trim()))
    .filter((value) => !Number.isNaN(value));
}

export function splitNotes(notes: number[]): [string, string, string] {
  return [
    notes[0]?.toString() ?? "",
    notes[1]?.toString() ?? "",
    notes[2]?.toString() ?? "",
  ];
}

export function maskCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function normalizeGradeInput(value: string): string {
  return value.replace(/[^\d.,\s-]/g, "");
}

export function toIsoDate(dateInput: string): string {
  return new Date(dateInput).toISOString();
}

export function formatDate(value: string | number): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("pt-BR");
}

export function toInputDate(value: string | number): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
}

export function stripAccents(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
