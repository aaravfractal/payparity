"use client";

import { useTotalSubmissions } from "~~/hooks/payparity/useTotalSubmissions";

export const SocialProofCounter = () => {
  const { total, isLoading } = useTotalSubmissions();

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#1F2A25] bg-[#0A0F0D]/80 px-4 py-2 text-sm">
      <span className="font-mono font-semibold text-[#34E5B0] tabular-nums">
        {isLoading ? "—" : total.toLocaleString()}
      </span>
      <span className="text-[#7E938B]">salaries benchmarked privately</span>
    </div>
  );
};
