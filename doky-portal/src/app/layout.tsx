import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: "DOKY - Portal de Agendamento",
  description: "Marque a sua consulta de forma rápida e simples.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body
        className={`${plusJakartaSans.variable} ${montserrat.variable} antialiased`}
      >
        <ToastProvider>
          <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            {/* Decorative background blobs replicating the main app style */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-doky-bright)]/40 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-doky-blue)]/40 rounded-full blur-[100px]"></div>
          </div>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
