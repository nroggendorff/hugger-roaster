import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hugger Roaster",
  description: "Roast your favorite Hugging Face user! 👹",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <section className="min-h-screen h-full w-full flex items-center justify-center flex-col bg-zinc-100 gap-5 overflow-auto p-6">
          {children}
        </section>
      </body>
    </html>
  );
}
