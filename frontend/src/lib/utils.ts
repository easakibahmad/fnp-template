import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const AVATAR_COLORS = [
  ["bg-blue-100", "text-blue-700"],
  ["bg-purple-100", "text-purple-700"],
  ["bg-emerald-100", "text-emerald-700"],
  ["bg-orange-100", "text-orange-700"],
  ["bg-rose-100", "text-rose-700"],
  ["bg-amber-100", "text-amber-700"],
] as const;

export function nurseAvatarColors(nurseId: string): readonly [string, string] {
  const i = nurseId.charCodeAt(nurseId.length - 1) % AVATAR_COLORS.length;
  return AVATAR_COLORS[i];
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

export function todayIso(): string {
  return new Date().toISOString().split("T")[0];
}

export function daysUntil(iso: string): number {
  const target = new Date(iso).getTime();
  const now = new Date().setHours(0, 0, 0, 0);
  return Math.floor((target - now) / (1000 * 60 * 60 * 24));
}
