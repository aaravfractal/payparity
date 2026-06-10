"use client";

import { useState } from "react";
import { shareTweetText, shareUrl } from "~~/components/payparity/constants";
import { btnPrimary, btnSecondary, card } from "~~/components/payparity/styles";
import { trackEvent } from "~~/utils/analytics";

type UnlockShareCardProps = {
  roleSlug: string;
  levelSlug: string;
  roleLabel: string;
  levelLabel: string;
  categoryCount: number;
};

export const UnlockShareCard = ({
  roleSlug,
  levelSlug,
  roleLabel,
  levelLabel,
  categoryCount,
}: UnlockShareCardProps) => {
  const [copied, setCopied] = useState(false);
  const link = shareUrl(roleSlug, levelSlug);
  const remaining = Math.max(0, 5 - categoryCount);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      trackEvent("invite_shared", { method: "copy", role: roleSlug, level: levelSlug });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const handleShareX = () => {
    const text = shareTweetText(roleLabel, levelLabel, link, categoryCount);
    trackEvent("invite_shared", { method: "x", role: roleSlug, level: levelSlug });
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className={card}>
      <h3 className="font-bold text-lg text-[#EAF2EE] mb-2">Help unlock this benchmark</h3>
      <p className="text-sm text-[#7E938B] mb-4 !mt-0">
        {remaining > 0
          ? `${remaining} more submission${remaining === 1 ? "" : "s"} needed for ${roleLabel} · ${levelLabel}. Share this link with peers.`
          : "This category is unlocked — share so others can contribute."}
      </p>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          readOnly
          value={link}
          className="flex-1 bg-[#0A0F0D] border border-[#1F2A25] rounded-lg px-3 py-2 text-xs font-mono text-[#7E938B] truncate"
        />
        <button type="button" className={`${btnSecondary} px-4 py-2 text-sm`} onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <button type="button" className={`${btnPrimary} w-full sm:w-auto`} onClick={handleShareX}>
        Share on X
      </button>
    </div>
  );
};
