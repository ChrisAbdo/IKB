import { Navbar } from "@/components/navbar";
import { Metadata } from "next";
import { Toaster } from "sonner";
import "../globals.css";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/layout/theme-provider";
import ContentWrapper from "@/components/layout/content-wrapper";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://ai-sdk-preview-internal-knowledge-base.vercel.app"
  ),
  title: "Internal Knowledge Base",
  description:
    "Internal Knowledge Base using Retrieval Augmented Generation and Middleware",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <ContentWrapper>{children}</ContentWrapper>
    </>
  );
}