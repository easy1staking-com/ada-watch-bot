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

  // ---- wallet/account change autodetection (CIP-30 has no standard change event) ----
  // Re-check the change address on window focus / tab visibility and on a slow poll
  // while visible: if the user switched account in the wallet extension, the address
  // differs (or the old API handle is dead) and we silently re-sync. Consumers keyed
  // on `address` (e.g. the vault list) refresh automatically.
  useEffect(() => {
    if (!walletName) return;
    let checking = false;

    const recheck = async () => {
      if (checking || document.visibilityState === "hidden") return;
      checking = true;
      try {
        const { BrowserWallet } = await import("@meshsdk/core");
        // re-enable is cheap when already authorized and survives account switches
        const fresh = await BrowserWallet.enable(walletName);
        const current = await fresh.getChangeAddress();
        if (current && current !== address) {
          setWallet(fresh);
          setAddress(current);
        }
      } catch {
        // wallet locked or permission revoked — keep last state; user can reconnect
      } finally {
        checking = false;
      }
    };

    window.addEventListener("focus", recheck);
    document.addEventListener("visibilitychange", recheck);
    const interval = setInterval(recheck, 30_000);
    return () => {
      window.removeEventListener("focus", recheck);
      document.removeEventListener("visibilitychange", recheck);
      clearInterval(interval);
    };
  }, [walletName, address]);

  return (
    <WalletCtx.Provider value={{ installed, wallet, walletName, address, connecting, connect, disconnect }}>
      {children}
    </WalletCtx.Provider>
  );
}
