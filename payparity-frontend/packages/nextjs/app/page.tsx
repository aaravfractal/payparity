"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { AboutSection } from "~~/components/payparity/AboutSection";
import {
  ETHERSCAN_URL,
  GITHUB_URL,
  LEVELS,
  ROLES,
  levelIdFromSlug,
  roleIdFromSlug,
} from "~~/components/payparity/constants";
import { DemoBenchmark } from "~~/components/payparity/DemoBenchmark";
import { ForCompaniesSection } from "~~/components/payparity/ForCompaniesSection";
import { HowItWorksSection } from "~~/components/payparity/HowItWorksSection";
import { SocialProofCounter } from "~~/components/payparity/SocialProofCounter";
import { TrustRow } from "~~/components/payparity/TrustRow";
import { UnlockShareCard } from "~~/components/payparity/UnlockShareCard";
import { btnPrimary, card, fieldCls, labelCls, linkMint } from "~~/components/payparity/styles";
import { RainbowKitCustomConnectButton } from "~~/components/helper/RainbowKitCustomConnectButton";
import { usePayParity } from "~~/hooks/payparity/usePayParity";
import { trackEvent } from "~~/utils/analytics";

function HeroGlow() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 -top-8 h-64 rounded-full opacity-60"
      style={{
        background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(52,229,176,0.1), transparent 70%)",
      }}
      aria-hidden
    />
  );
}

function PayParityApp() {
  const { isConnected } = useAccount();
  const searchParams = useSearchParams();

  const [roleId, setRoleId] = useState(1);
  const [levelId, setLevelId] = useState(2);
  const [salary, setSalary] = useState("");
  const [showShareCard, setShowShareCard] = useState(false);
  const revealedTracked = useRef(false);

  useEffect(() => {
    const role = roleIdFromSlug(searchParams.get("role"));
    const level = levelIdFromSlug(searchParams.get("level"));
    if (role) setRoleId(role);
    if (level) setLevelId(level);
  }, [searchParams]);

  const categoryId = roleId * 10 + levelId;
  const pp = usePayParity(categoryId);

  const role = ROLES.find(r => r.id === roleId);
  const level = LEVELS.find(l => l.id === levelId);
  const roleLabel = role?.label ?? "";
  const levelLabel = level?.label ?? "";

  useEffect(() => {
    if (pp.message.includes("Salary submitted!")) {
      setShowShareCard(true);
      trackEvent("salary_submitted", { role: role?.slug ?? "", level: level?.slug ?? "" });
    }
  }, [pp.message, role?.slug, level?.slug]);

  useEffect(() => {
    if (pp.averageSalary !== undefined && !revealedTracked.current) {
      revealedTracked.current = true;
      trackEvent("benchmark_revealed", { role: role?.slug ?? "", level: level?.slug ?? "" });
    }
    if (pp.averageSalary === undefined) {
      revealedTracked.current = false;
    }
  }, [pp.averageSalary, role?.slug, level?.slug]);

  const handleSubmit = () => {
    const n = parseInt(salary, 10);
    if (!Number.isNaN(n) && n > 0) {
      pp.submitSalary(n);
    }
  };

  const progress = Math.min(pp.categoryCount / 5, 1) * 100;
  const isLocked = !pp.isRevealReady && pp.averageSalary === undefined;

  return (
    <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <HeroGlow />

      <div className="relative text-center mb-8 sm:mb-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#34E5B0] mb-2 !mt-0">
          Confidential · FHE-powered
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#EAF2EE] mb-2">
          Compare pay fairly — without exposing yours
        </h1>
        <p className="text-[#7E938B] max-w-md mx-auto !mt-0 mb-5">
          Submit your salary fully encrypted. Unlock role-based benchmarks when 5 people contribute.
        </p>
        <div className="flex justify-center mb-4">
          <SocialProofCounter />
        </div>
        {!isConnected && (
          <div className="flex justify-center mb-4">
            <RainbowKitCustomConnectButton />
          </div>
        )}
        <TrustRow />
      </div>

      {!isConnected && <DemoBenchmark />}

      {isConnected && (
        <>
          <div className={card}>
            <h3 className="font-bold text-lg text-[#EAF2EE] mb-5">Submit your salary (private)</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelCls}>Role</label>
                <select className={fieldCls} value={roleId} onChange={e => setRoleId(Number(e.target.value))}>
                  {ROLES.map(r => (
                    <option key={r.id} value={r.id} className="bg-[#0A0F0D]">
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Level</label>
                <select className={fieldCls} value={levelId} onChange={e => setLevelId(Number(e.target.value))}>
                  {LEVELS.map(l => (
                    <option key={l.id} value={l.id} className="bg-[#0A0F0D]">
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-5">
              <label className={labelCls}>Annual salary (USD)</label>
              <input
                className={fieldCls}
                type="number"
                placeholder="e.g. 90000"
                value={salary}
                onChange={e => setSalary(e.target.value)}
              />
              <p className="text-xs text-[#7E938B] mt-2 !mb-0">
                Encrypted on your device. The contract never sees your individual number.
              </p>
            </div>

            <button className={btnPrimary} disabled={!pp.canSubmit || salary === ""} onClick={handleSubmit}>
              {pp.isProcessing ? "Submitting privately..." : "Submit Encrypted Salary"}
            </button>
          </div>

          <div className={card}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
              <h3 className="font-bold text-lg text-[#EAF2EE]">
                {roleLabel} · {levelLabel} benchmark
              </h3>
              {pp.isRevealReady && (
                <span className="text-xs font-medium uppercase tracking-wider text-[#34E5B0]">Unlocked</span>
              )}
            </div>

            <div className="mb-5">
              <div className="flex justify-between text-xs text-[#7E938B] mb-2">
                <span>Privacy threshold</span>
                <span className="font-mono">
                  {pp.categoryCount} / 5 {pp.isRevealReady ? "✓" : ""}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#0A0F0D] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    pp.isRevealReady ? "bg-[#34E5B0]" : "progress-fill-animated"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              {isLocked && (
                <p className="text-xs text-[#7E938B] mt-2 !mb-0">
                  Be the first — 5 submissions unlock the benchmark.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between py-3 border-t border-[#1F2A25]">
              <span className="text-[#7E938B]">Submissions in this category</span>
              <span className="font-mono text-[#EAF2EE]">{pp.categoryCount}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-[#1F2A25]">
              <span className="text-[#7E938B] flex items-center gap-1.5">
                Average salary
                {isLocked && <LockClosedIcon className="w-3.5 h-3.5 text-[#7E938B]" aria-hidden />}
                {isLocked && <span className="text-[#7E938B]">: Locked</span>}
              </span>
              <span className="font-mono">
                {pp.averageSalary !== undefined ? (
                  <span
                    key={pp.averageSalary}
                    className="inline-block text-2xl sm:text-3xl font-bold text-[#E8C46A] animate-reveal-in"
                  >
                    {"$" + Math.round(pp.averageSalary).toLocaleString()}
                  </span>
                ) : pp.isRevealReady ? (
                  <span className="text-[#7E938B]">Hidden — click reveal</span>
                ) : null}
              </span>
            </div>

            {pp.isRevealReady && pp.averageSalary === undefined && (
              <button
                className={`${btnPrimary} mt-5 w-full sm:w-auto`}
                disabled={!pp.canReveal}
                onClick={pp.revealAverage}
              >
                {pp.isRevealing ? "Revealing..." : "Reveal Average Benchmark"}
              </button>
            )}

            {!pp.isRevealReady && (
              <p className="text-sm text-[#7E938B] mt-4 leading-relaxed !mb-0">
                The average stays locked until at least 5 people submit to this category — so no individual salary
                can ever be reverse-engineered. This threshold is enforced on-chain.
              </p>
            )}
          </div>

          {showShareCard && role && level && (
            <UnlockShareCard
              roleSlug={role.slug}
              levelSlug={level.slug}
              roleLabel={roleLabel}
              levelLabel={levelLabel}
              categoryCount={pp.categoryCount}
            />
          )}

          {pp.message && (
            <div className="bg-[#121A17] border border-[#1F2A25] rounded-2xl px-5 py-4 mb-6">
              <p className="font-mono text-xs text-[#7E938B] break-words !m-0">{pp.message}</p>
            </div>
          )}
        </>
      )}

      <HowItWorksSection />
      <AboutSection />
      <ForCompaniesSection />

      <p className="text-center text-xs text-[#7E938B] !mt-0">
        Live on Sepolia ·{" "}
        <a href={ETHERSCAN_URL} target="_blank" rel="noopener noreferrer" className={`font-mono ${linkMint}`}>
          0xE48C...62523
        </a>
        {" · "}
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={linkMint}>
          Open source
        </a>
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-20 text-center text-[#7E938B]">Loading...</div>}>
      <PayParityApp />
    </Suspense>
  );
}
