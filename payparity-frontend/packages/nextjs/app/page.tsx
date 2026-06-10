"use client";

import { useState } from "react";
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

const card = "bg-[#121A17] border border-[#1F2A25] rounded-2xl p-6 mb-6";
const labelCls = "block text-xs font-medium uppercase tracking-wider text-[#7E938B] mb-2";
const fieldCls =
  "w-full bg-[#0A0F0D] border border-[#1F2A25] rounded-lg px-3 py-2.5 text-[#EAF2EE] " +
  "focus:border-[#34E5B0] focus:outline-none transition-colors";
const btn =
  "inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all " +
  "disabled:opacity-40 disabled:cursor-not-allowed";
const btnPrimary = `${btn} bg-[#34E5B0] text-[#0A0F0D] hover:bg-[#2BD19E] cursor-pointer`;

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
      <div className="max-w-2xl mx-auto px-6 py-20">
        <div className="bg-[#121A17] border border-[#1F2A25] rounded-2xl p-10 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#34E5B0] mb-3">
            {"Confidential \u00B7 FHE-powered"}
          </p>
          <h1 className="text-4xl font-bold text-[#EAF2EE] mb-3">PayParity</h1>
          <p className="text-[#7E938B] mb-8 max-w-sm mx-auto">
            Prove fair pay. Expose nothing. Connect your wallet to submit a fully encrypted
            salary and see role-based benchmarks.
          </p>
          <div className="flex justify-center">
            <RainbowKitCustomConnectButton />
          </div>
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

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#34E5B0] mb-2">
          {"Confidential \u00B7 FHE-powered"}
        </p>
        <h1 className="text-4xl font-bold text-[#EAF2EE] mb-2">PayParity</h1>
        <p className="text-[#7E938B]">Prove fair pay. Expose nothing.</p>
      </div>

      <div className={card}>
        <h3 className="font-bold text-lg text-[#EAF2EE] mb-5">Submit your salary (private)</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
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
          <p className="text-xs text-[#7E938B] mt-2">
            Encrypted on your device. The contract never sees your individual number.
          </p>
        </div>

        <button className={btnPrimary} disabled={!pp.canSubmit || salary === ""} onClick={handleSubmit}>
          {pp.isProcessing ? "Submitting privately..." : "Submit Encrypted Salary"}
        </button>
      </div>

      <div className={card}>
        <div className="flex items-center justify-between mb-5">
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
              className="h-full rounded-full bg-[#34E5B0] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-[#1F2A25]">
          <span className="text-[#7E938B]">Submissions in this category</span>
          <span className="font-mono text-[#EAF2EE]">{pp.categoryCount}</span>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-[#1F2A25]">
          <span className="text-[#7E938B]">Average salary</span>
          <span className="font-mono">
            {pp.averageSalary !== undefined ? (
              <span className="text-2xl font-bold text-[#E8C46A]">
                {"$" + Math.round(pp.averageSalary).toLocaleString()}
              </span>
            ) : pp.isRevealReady ? (
              <span className="text-[#7E938B]">{"Hidden \u2014 click reveal"}</span>
            ) : (
              <span className="text-[#7E938B]">Locked</span>
            )}
          </span>
        </div>

        {pp.isRevealReady && pp.averageSalary === undefined && (
          <button className={`${btnPrimary} mt-5`} disabled={!pp.canReveal} onClick={pp.revealAverage}>
            {pp.isRevealing ? "Revealing..." : "Reveal Average Benchmark"}
          </button>
        )}

        {!pp.isRevealReady && (
          <p className="text-sm text-[#7E938B] mt-4 leading-relaxed">
            {"The average stays locked until at least 5 people submit to this category \u2014 so no individual salary can ever be reverse-engineered. This threshold is enforced on-chain."}
          </p>
        )}
      </div>

      {pp.message && (
        <div className="bg-[#121A17] border border-[#1F2A25] rounded-2xl px-5 py-4 mb-6">
          <p className="font-mono text-xs text-[#7E938B] break-words">{pp.message}</p>
        </div>
      )}

      {pp.contractAddress && (
        <p className="text-center text-xs text-[#7E938B]">
          {"Live on Sepolia \u00B7 "}
          <a
            href={`https://sepolia.etherscan.io/address/${pp.contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[#34E5B0] hover:underline"
          >
            {pp.contractAddress.slice(0, 6) + "..." + pp.contractAddress.slice(-4)}
          </a>
        </p>
      )}
    </div>
  );
}
