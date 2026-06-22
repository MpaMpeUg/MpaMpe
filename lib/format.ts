export function formatMoney(
  amount: number,
  currency: "UGX" = "UGX",
): string {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function campaignProgress(raised: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-UG", {
    dateStyle: "long",
  }).format(new Date(date));
}
