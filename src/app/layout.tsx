// app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/providers/ClientProviders";
import { createClient } from "@/supabase/server";  // <— your helper

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseServer = await createClient();

  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* ③ Pass that user to your client tree */}
        <ClientProviders initialUser={user}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
