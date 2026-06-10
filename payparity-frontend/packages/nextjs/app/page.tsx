"use client";

import { useState } from "react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/helper/RainbowKitCustomConnectButton";
import { usePayParity } from "~~/hooks/payparity/usePayParity";

const ROLES = [
  { id: 1, label: "Engineer" },
  { id: 2, label: "Designer" },
  { id: 3, label: "Product Manager" },
  { id: 4, label: "Data Scientist" },
];

const LEVELS = [
  { id: 1, label: "Junior" },
  { id: 2, label: "Mid" },
  { id: 3, label: "Senior" },
];

const ETHERSCAN_URL =
  "https://sepolia.etherscan.io/address/0xE48C7CcEB4dA68FA71ccEB94a7d8146Ba4a62523#code";
const GITHUB_URL = "https://github.com/aaravfractal/payparity";

const HOW_IT_WORKS = [
  { step: "1", title: "Submit encrypted", detail: "Your salary is encrypted on-device before it ever leaves your browser." },
  { step: "2", title: "Aggregate on-chain", detail: "The contract adds encrypted values — no individual number is ever exposed." },
  { step: "3", title: "Reveal at 5", detail: "Once 5 people submit to a category, the average benchmark unlocks." },
];

const card =
  "bg-[#121A17] border border-[#1F2A25] rounded-2xl p-5 sm:p-6 mb-6 " +
  "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(52,229,176,0.06)]";
const labelCls = "block text-xs font-medium uppercase tracking-wider text-[#7E938B] mb-2";
const fieldCls =
  "w-full bg-[#0A0F0D] border border-[#1F2A25] rounded-lg px-3 py-2.5 text-[#EAF2EE] " +
  "focus:border-[#34E5B0] focus:outline-none focus:ring-2 focus:ring-[#34E5B0]/20 " +
  "transition-all duration-200";
const btn =
  "inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 " +
  "disabled:opacity-40 disabled:cursor-not-allowed";
const btnPrimary = `${btn} bg-[#34E5B0] text-[#0A0F0D] hover:bg-[#2BD19E] cursor-pointer`;
const linkMint = "text-[#34E5B0] hover:underline transition-colors duration-200";

function TrustRow() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-[#7E938B]">
      <span>Live on Sepolia</span>
      <span className="text-[#1F2A25]" aria-hidden>
        {"·"}
      </span>
      <a href={ETHERSCAN_URL} target="_blank" rel="noopener noreferrer" className={linkMint}>
        Verified contract
      </a>
      <span className="text-[#1F2A25]" aria-hidden>
        {"·"}
      </span>
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={linkMint}>
        Open source
      </a>
    </div>
  );
}

function HowItWorks() {
  return (
    <div className="mt-8 pt-8 border-t border-[#1F2A25]">
      <p className="text-xs font-medium uppercase tracking-wider text-[#7E938B] mb-4">How it works</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        {HOW_IT_WORKS.map(item => (
          <div key={item.step} className="rounded-xl border border-[#1F2A25] bg-[#0A0F0D]/60 p-4">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#34E5B0]/15 text-[#34E5B0] text-xs font-bold mb-2">
              {item.step}
            </span>
            <p className="text-sm font-semibold text-[#EAF2EE] mb-1">{item.title}</p>
            <p className="text-xs text-[#7E938B] leading-relaxed !m-0">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { isConnected } = useAccount();

  const [roleId, setRoleId] = useState(1);
  const [levelId, setLevelId] = useState(2);
  const [salary, setSalary] = useState("");

  const categoryId = roleId * 10 + levelId;
  const pp = usePayParity(categoryId);

  const roleLabel = ROLES.find(r => r.id === roleId)?.label ?? "";
  const levelLabel = LEVELS.find(l => l.id === levelId)?.label ?? "";

  if (!isConnected) {
    return (
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div
          className="pointer-events-none absolute inset-x-0 -top-8 h-64 rounded-full opacity-60"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(52,229,176,0.1), transparent 70%)",
          }}
          aria-hidden
        />
        <div className={`relative ${card} p-8 sm:p-10 text-center`}>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#34E5B0] mb-3 !mt-0">
            {"Confidential \u00B7 FHE-powered"}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#EAF2EE] mb-3">PayParity</h1>
          <p className="text-[#7E938B] mb-8 max-w-sm mx-auto !mt-0">
            Prove fair pay. Expose nothing. Connect your wallet to submit a fully encrypted salary and see
            role-based benchmarks.
          </p>
          <div className="flex justify-center mb-6">
            <RainbowKitCustomConnectButton />
          </div>
          <TrustRow />
          <HowItWorks />
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    const n = parseInt(salary, 10);
    if (!Number.isNaN(n) && n > 0) {
      pp.submitSalary(n);
    }
  };

  const progress = Math.min(pp.categoryCount / 5, 1) * 100;
  const isLocked = !pp.isRevealReady && pp.averageSalary === undefined;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="relative text-center mb-8 sm:mb-10">
        <div
          className="pointer-events-none absolute inset-x-0 -top-6 h-40 rounded-full opacity-50"
          style={{
            background: "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(52,229,176,0.08), transparent 70%)",
          }}
          aria-hidden
        />
        <p className="relative text-xs font-medium uppercase tracking-[0.2em] text-[#34E5B0] mb-2 !mt-0">
          {"Confidential \u00B7 FHE-powered"}
        </p>
        <h1 className="relative text-3xl sm:text-4xl font-bold text-[#EAF2EE] mb-2">PayParity</h1>
        <p className="relative text-[#7E938B] !mt-0">Prove fair pay. Expose nothing.</p>
      </div>

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
            {roleLabel} {"\u00B7"} {levelLabel} benchmark
          </h3>
          {pp.isRevealReady && (
            <span className="text-xs font-medium uppercase tracking-wider text-[#34E5B0]">Unlocked</span>
          )}
        </div>

        <div className="mb-5">
          <div className="flex justify-between text-xs text-[#7E938B] mb-2">
            <span>Privacy threshold</span>
            <span className="font-mono">
              {pp.categoryCount} / 5 {pp.isRevealReady ? "\u2713" : ""}
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
              <span className="text-[#7E938B]">{"Hidden \u2014 click reveal"}</span>
            ) : null}
          </span>
        </div>

        {pp.isRevealReady && pp.averageSalary === undefined && (
          <button className={`${btnPrimary} mt-5 w-full sm:w-auto`} disabled={!pp.canReveal} onClick={pp.revealAverage}>
            {pp.isRevealing ? "Revealing..." : "Reveal Average Benchmark"}
          </button>
        )}

        {!pp.isRevealReady && (
          <p className="text-sm text-[#7E938B] mt-4 leading-relaxed !mb-0">
            {
              "The average stays locked until at least 5 people submit to this category \u2014 so no individual salary can ever be reverse-engineered. This threshold is enforced on-chain."
            }
          </p>
        )}
      </div>

      {pp.message && (
        <div className="bg-[#121A17] border border-[#1F2A25] rounded-2xl px-5 py-4 mb-6">
          <p className="font-mono text-xs text-[#7E938B] break-words !m-0">{pp.message}</p>
        </div>
      )}

      {pp.contractAddress && (
        <p className="text-center text-xs text-[#7E938B] !mt-0">
          {"Live on Sepolia \u00B7 "}
          <a
            href={`https://sepolia.etherscan.io/address/${pp.contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-mono ${linkMint}`}
          >
            {pp.contractAddress.slice(0, 6) + "..." + pp.contractAddress.slice(-4)}
          </a>
          {" \u00B7 "}
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={linkMint}>
            Open source
          </a>
        </p>
      )}
    </div>
  );
}
