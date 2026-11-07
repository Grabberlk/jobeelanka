import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "LKR"): string {
  if (currency === "USD") {
    return `$${amount.toLocaleString("en-US")}`;
  }
  return `LKR ${amount.toLocaleString("en-US")}`;
}

export function formatDateRelative(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function buildWhatsAppUrl(phone: string, jobTitle: string, company: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const message = encodeURIComponent(
    `Hello! I saw the "${jobTitle}" opening at ${company} on JobeeLanka and would like to apply.`
  );
  return `https://wa.me/${cleanPhone}?text=${message}`;
}

