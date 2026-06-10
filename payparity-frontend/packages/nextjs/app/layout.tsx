import "@rainbow-me/rainbowkit/styles.css";
import { Analytics } from "@vercel/analytics/react";
import { DappWrapperWithProviders } from "~~/components/DappWrapperWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/helper/getMetadata";

export const metadata = getMetadata({
  title: "PayParity — Prove fair pay. Expose nothing.",
  description:
    "Confidential salary benchmarks powered by Zama FHE. Submit encrypted, aggregate on-chain, reveal at 5 — provable fairness with zero individual exposure.",
  imageRelativePath: "/og.png",
  siteUrl: "https://payparity-gilt.vercel.app",
});

const DappWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning className={``}>
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=telegraf@400,500,700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          <DappWrapperWithProviders>{children}</DappWrapperWithProviders>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default DappWrapper;
