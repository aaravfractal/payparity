"use client";

import { useRef, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { GITHUB_URL } from "~~/components/payparity/constants";
import { linkMint } from "~~/components/payparity/styles";
import { RainbowKitCustomConnectButton } from "~~/components/helper";
import { useOutsideClick } from "~~/hooks/helper";

const NAV_LINKS: { href: string; label: string; external?: boolean }[] = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#about", label: "About" },
  { href: "#for-companies", label: "For companies" },
  { href: GITHUB_URL, label: "GitHub", external: true },
];

export const Header = () => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useOutsideClick(menuRef, () => setMenuOpen(false));

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-30 bg-[#0A0F0D]/90 backdrop-blur-md border-b border-[#1F2A25]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <a href="#" className="text-lg font-bold text-[#EAF2EE] tracking-tight shrink-0 hover:text-[#34E5B0] transition-colors duration-200">
          PayParity
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV_LINKS.map(link =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkMint} no-underline hover:opacity-80`}
              >
                {link.label}
              </a>
            ) : (
              <a key={link.href} href={link.href} className="text-[#7E938B] hover:text-[#34E5B0] transition-colors duration-200">
                {link.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <div className="hidden md:block">
            <RainbowKitCustomConnectButton />
          </div>
          <div ref={menuRef} className="md:hidden relative">
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="p-2 text-[#EAF2EE] hover:text-[#34E5B0] transition-colors"
              onClick={() => setMenuOpen(o => !o)}
            >
              {menuOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
            </button>
            {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-[#1F2A25] bg-[#121A17] p-2 shadow-lg z-40">
              {NAV_LINKS.map(link =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    className="block px-3 py-2 text-sm text-[#34E5B0] rounded-lg hover:bg-[#0A0F0D]"
                  >
                    {link.label}
                  </a>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="block px-3 py-2 text-sm text-[#EAF2EE] rounded-lg hover:bg-[#0A0F0D] hover:text-[#34E5B0]"
                  >
                    {link.label}
                  </a>
                ),
              )}
            </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
