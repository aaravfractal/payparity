"use client";

import { useState } from "react";
import { DEMO_BENCHMARK } from "~~/components/payparity/constants";
import { btnSecondary, card } from "~~/components/payparity/styles";

export const DemoBenchmark = () => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className={card}>
      {!showDemo ? (
        <div className="text-center">
          <p className="text-sm text-[#7E938B] mb-4 !mt-0">
            Curious what an unlocked benchmark looks like?
          </p>
          <button type="button" className={btnSecondary} onClick={() => setShowDemo(true)}>
            See a live benchmark
          </button>
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h3 className="font-bold text-lg text-[#EAF2EE]">
              {DEMO_BENCHMARK.role} · {DEMO_BENCHMARK.level} benchmark
            </h3>
            <span className="text-xs font-medium uppercase tracking-wider text-[#7E938B] border border-[#1F2A25] rounded-full px-2 py-0.5">
              demo
            </span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-[#7E938B] mb-2">
              <span>Privacy threshold</span>
              <span className="font-mono">
                {DEMO_BENCHMARK.submissions} / 5 ✓
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#0A0F0D] overflow-hidden">
              <div className="h-full w-full rounded-full bg-[#34E5B0]" />
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-[#1F2A25]">
            <span className="text-[#7E938B]">Average salary</span>
            <span className="text-2xl sm:text-3xl font-bold text-[#E8C46A] animate-reveal-in">
              {"$" + DEMO_BENCHMARK.average.toLocaleString()}
            </span>
          </div>

          <p className="text-xs text-[#7E938B] mt-4 !mb-0">
            Sample data for preview only. Connect your wallet to submit and unlock real benchmarks.
          </p>
        </div>
      )}
    </div>
  );
};
