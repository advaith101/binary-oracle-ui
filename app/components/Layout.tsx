'use client';

import React, { ReactNode } from 'react';
import { ClientWalletProvider } from './WalletProvider';
import dynamic from 'next/dynamic';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ClientWalletProvider>
        <div className="min-h-screen bg-background">
          <header className="border-b">
            <div className="container mx-auto py-4 px-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold">Binary Oracle</h1>
              <WalletMultiButtonDynamic />
            </div>
          </header>
          <main className="container mx-auto py-6 px-4">
            {children}
          </main>
        </div>
        <Toaster />
      </ClientWalletProvider>
    </ThemeProvider>
  );
};

export default Layout;