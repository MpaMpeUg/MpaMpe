export type DonationTotals = {
  campaignAmount: number;
  tipAmount: number;
  totalAmount: number;
};

export type TipOption = {
  label: string;
  amount: number;
  percentage: number;
};

export function calculateCampaignProgress(raised: number, goal: number) {
  if (goal <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((raised / goal) * 100)));
}

export function calculateDonationTotals(
  amount: number,
  tipAmount: number,
): DonationTotals {
  const campaignAmount = normalizeMoney(amount);
  const platformTip = normalizeMoney(tipAmount);

  return {
    campaignAmount,
    tipAmount: platformTip,
    totalAmount: campaignAmount + platformTip,
  };
}

export function platformTipOptions(amount: number): TipOption[] {
  const campaignAmount = normalizeMoney(amount);
  return [
    { label: "No tip", amount: 0, percentage: 0 },
    { label: "5%", amount: normalizeMoney(campaignAmount * 0.05), percentage: 5 },
    { label: "10%", amount: normalizeMoney(campaignAmount * 0.1), percentage: 10 },
    { label: "15%", amount: normalizeMoney(campaignAmount * 0.15), percentage: 15 },
  ];
}

export function publicBackerName(
  donorName: string | null | undefined,
  anonymous: boolean,
) {
  if (anonymous) return "Anonymous";
  const cleaned = donorName?.trim();
  return cleaned || "MpaMpe supporter";
}

export function storagePathsBelongToUser(
  userId: string,
  imagePath: string,
  documentPaths: string[],
) {
  const prefix = `${userId}/`;
  return (
    imagePath.startsWith(prefix) &&
    documentPaths.every((path) => path.startsWith(prefix))
  );
}

function normalizeMoney(value: number) {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.round(value);
}
