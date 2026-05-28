import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/toast-provider";
import { getLocale } from "@/lib/i18n/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plenty Barber",
  description: "Premium AI visagism reports for barbershops, salons and beauty businesses."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getLocale();

  return (
    <html lang={locale} className="dark">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
