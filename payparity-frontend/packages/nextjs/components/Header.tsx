"use client";

import React, { useRef } from "react";
import { RainbowKitCustomConnectButton } from "~~/components/helper";
import { useOutsideClick } from "~~/hooks/helper";

/**
 * Site header
 */
export const Header = () => {
  const burgerMenuRef = useRef<HTMLDetailsElement>(null);
  useOutsideClick(burgerMenuRef, () => {
    burgerMenuRef?.current?.removeAttribute("open");
  });

  return (
    <div className="sticky lg:static top-0 navbar min-h-0 shrink-0 justify-end z-20 px-4 sm:px-6 py-3 bg-[#0A0F0D]/80 backdrop-blur-sm border-b border-[#1F2A25]">
      <div className="navbar-end">
        <RainbowKitCustomConnectButton />
      </div>
    </div>
  );
};
