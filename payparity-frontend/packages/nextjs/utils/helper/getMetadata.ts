import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://payparity-gilt.vercel.app";

export const getMetadata = ({
  title,
  description,
  imageRelativePath = "/og.png",
  siteUrl = baseUrl,
}: {
  title: string;
  description: string;
  imageRelativePath?: string;
  siteUrl?: string;
}): Metadata => {
  const imageUrl = `${siteUrl}${imageRelativePath}`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: "%s | PayParity",
    },
    description,
    openGraph: {
      type: "website",
      url: siteUrl,
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    themeColor: "#0A0F0D",
    icons: {
      icon: [{ url: "/favicon.png", sizes: "32x32", type: "image/png" }],
    },
  };
};
