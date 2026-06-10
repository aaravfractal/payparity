export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://payparity-gilt.vercel.app";

export const ETHERSCAN_URL =
  "https://sepolia.etherscan.io/address/0xE48C7CcEB4dA68FA71ccEB94a7d8146Ba4a62523#code";
export const GITHUB_URL = "https://github.com/aaravfractal/payparity";
export const X_URL = process.env.NEXT_PUBLIC_X_URL ?? "https://x.com/payparity";
export const COMPANY_FORM_URL = process.env.NEXT_PUBLIC_COMPANY_FORM_URL ?? "";

export const ROLES = [
  { id: 1, label: "Engineer", slug: "engineer" },
  { id: 2, label: "Designer", slug: "designer" },
  { id: 3, label: "Product Manager", slug: "product-manager" },
  { id: 4, label: "Data Scientist", slug: "data-scientist" },
] as const;

export const LEVELS = [
  { id: 1, label: "Junior", slug: "junior" },
  { id: 2, label: "Mid", slug: "mid" },
  { id: 3, label: "Senior", slug: "senior" },
] as const;

export const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Submit encrypted",
    detail: "Your salary is encrypted on-device before it ever leaves your browser.",
  },
  {
    step: "2",
    title: "Aggregate on-chain",
    detail: "The contract adds encrypted values — no individual number is ever exposed.",
  },
  {
    step: "3",
    title: "Reveal at 5",
    detail: "Once 5 people submit to a category, the average benchmark unlocks.",
  },
] as const;

export const DEMO_BENCHMARK = {
  role: "Engineer",
  level: "Mid",
  average: 142_500,
  submissions: 5,
} as const;

export function roleIdFromSlug(slug: string | null): number | undefined {
  if (!slug) return undefined;
  return ROLES.find(r => r.slug === slug.toLowerCase())?.id;
}

export function levelIdFromSlug(slug: string | null): number | undefined {
  if (!slug) return undefined;
  return LEVELS.find(l => l.slug === slug.toLowerCase())?.id;
}

export function shareUrl(roleSlug: string, levelSlug: string, origin?: string): string {
  const base = origin ?? (typeof window !== "undefined" ? window.location.origin : SITE_URL);
  return `${base}/?role=${roleSlug}&level=${levelSlug}`;
}

export function shareTweetText(
  roleLabel: string,
  levelLabel: string,
  link: string,
  categoryCount: number,
): string {
  const remaining = Math.max(0, 5 - categoryCount);
  return `I just added my salary privately to PayParity — ${remaining} more unlock the ${roleLabel} · ${levelLabel} benchmark. Add yours: ${link}`;
}
