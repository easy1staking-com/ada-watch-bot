"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { BrowserWallet } from "@meshsdk/core";

interface InstalledWallet {
  id: string;
  name: string;
  icon: string;
}

interface WalletState {
  installed: InstalledWallet[];
  wallet: BrowserWallet | null;
  walletName: string | null;
  address: string | null;
  connecting: boolean;
  connect: (id: string) => Promise<void>;
  disconnect: () => void;
}

const WalletCtx = createContext<WalletState | null>(null);

export function useWallet(): WalletState {
  const ctx = useContext(WalletCtx);
  if (!ctx) throw new Error("useWallet outside WalletProvider");
  return ctx;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [installed, setInstalled] = useState<InstalledWallet[]>([]);
  const [wallet, setWallet] = useState<BrowserWallet | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const connect = useCallback(async (id: string) => {
    setConnecting(true);
    try {
      const { BrowserWallet } = await import("@meshsdk/core");
      const enabled = await BrowserWallet.enable(id);
      const changeAddress = await enabled.getChangeAddress();
      setWallet(enabled);
      setWalletName(id);
      setAddress(changeAddress);
      localStorage.setItem("adawatch.wallet", id);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet(null);
    setWalletName(null);
    setAddress(null);
    localStorage.removeItem("adawatch.wallet");
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { BrowserWallet } = await import("@meshsdk/core");
      const wallets = await BrowserWallet.getAvailableWallets();
      if (cancelled) return;
      setInstalled(wallets.map((w) => ({ id: w.id, name: w.name, icon: w.icon })));
      const remembered = localStorage.getItem("adawatch.wallet");
      if (remembered && wallets.some((w) => w.id === remembered)) {
        connect(remembered).catch(() => localStorage.removeItem("adawatch.wallet"));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [connect]);

  return (
    <WalletCtx.Provider value={{ installed, wallet, walletName, address, connecting, connect, disconnect }}>
      {children}
    </WalletCtx.Provider>
  );
}
