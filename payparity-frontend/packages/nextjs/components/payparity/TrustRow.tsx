import { ETHERSCAN_URL, GITHUB_URL } from "~~/components/payparity/constants";
import { linkMint } from "~~/components/payparity/styles";

export const TrustRow = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-[#7E938B]">
      <span>Live on Sepolia</span>
      <span className="text-[#1F2A25]" aria-hidden>
        ·
      </span>
      <a href={ETHERSCAN_URL} target="_blank" rel="noopener noreferrer" className={linkMint}>
        Verified contract
      </a>
      <span className="text-[#1F2A25]" aria-hidden>
        ·
      </span>
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={linkMint}>
        Open source
      </a>
    </div>
  );
};
