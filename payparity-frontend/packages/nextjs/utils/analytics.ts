import { track } from "@vercel/analytics";

export type AnalyticsEvent =
  | "connect_clicked"
  | "salary_submitted"
  | "benchmark_revealed"
  | "invite_shared"
  | "company_interest";

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, string | number | boolean>) {
  track(event, properties);
}
