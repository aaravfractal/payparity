"use client";

import { useState } from "react";
import { COMPANY_FORM_URL } from "~~/components/payparity/constants";
import { btnPrimary, card, fieldCls, sectionSubtitle, sectionTitle } from "~~/components/payparity/styles";
import { trackEvent } from "~~/utils/analytics";

export const ForCompaniesSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    trackEvent("company_interest", { email_domain: email.split("@")[1] ?? "unknown" });

    if (!COMPANY_FORM_URL) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(COMPANY_FORM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, source: "payparity_landing" }),
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="for-companies" className="scroll-mt-20">
      <div className={card}>
        <h2 className={sectionTitle}>For companies</h2>
        <p className={`${sectionSubtitle} !mt-0 !mb-6`}>
          Companies pay for verified confidential pay-gap reports — built on the same FHE benchmarks your team
          contributes to privately. Get early access.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg">
          <input
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={`${fieldCls} flex-1`}
            disabled={status === "submitting" || status === "done"}
          />
          <button
            type="submit"
            className={`${btnPrimary} shrink-0`}
            disabled={status === "submitting" || status === "done"}
          >
            {status === "submitting" ? "Sending..." : status === "done" ? "Thanks!" : "Get early access"}
          </button>
        </form>

        {status === "done" && (
          <p className="text-sm text-[#34E5B0] mt-3 !mb-0">We&apos;ll be in touch soon.</p>
        )}
        {status === "error" && (
          <p className="text-sm text-[#7E938B] mt-3 !mb-0">
            {COMPANY_FORM_URL
              ? "Something went wrong. Please try again."
              : "Form endpoint not configured yet. Set NEXT_PUBLIC_COMPANY_FORM_URL."}
          </p>
        )}
      </div>
    </section>
  );
};
