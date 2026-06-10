import { ETHERSCAN_URL, GITHUB_URL, X_URL } from "~~/components/payparity/constants";
import { linkMint } from "~~/components/payparity/styles";

export const Footer = () => {
  return (
    <footer className="border-t border-[#1F2A25] bg-[#0A0F0D] mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <p className="text-sm text-[#EAF2EE] font-medium mb-6 !mt-0">Prove fair pay. Expose nothing.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#7E938B] mb-3">Product</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#how-it-works" className="text-[#7E938B] hover:text-[#34E5B0] transition-colors duration-200">
                  How it works
                </a>
              </li>
              <li>
                <a href="#about" className="text-[#7E938B] hover:text-[#34E5B0] transition-colors duration-200">
                  About
                </a>
              </li>
              <li>
                <a href="#for-companies" className="text-[#7E938B] hover:text-[#34E5B0] transition-colors duration-200">
                  For companies
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#7E938B] mb-3">Resources</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={linkMint}>
                  GitHub
                </a>
              </li>
              <li>
                <a href={ETHERSCAN_URL} target="_blank" rel="noopener noreferrer" className={linkMint}>
                  Verified contract
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#7E938B] mb-3">Connect</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={X_URL} target="_blank" rel="noopener noreferrer" className={linkMint}>
                  X
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-[#7E938B] !mb-0">
          Built for the Zama Developer Program · Season 3 · Live on Sepolia · © 2026 PayParity
        </p>
      </div>
    </footer>
  );
};
