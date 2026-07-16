"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { SigningClient, WalletApi } from "@/lib/evolution";

interface InstalledWallet {
  id: string;
  name: string;
  icon: string;
}

/** CIP-30 initial API as injected on window.cardano.<id>. */
interface Cip30Initial {
  name: string;
  icon: string;
  apiVersion: string;
  enable(): Promise<WalletApi>;
}

declare global {
  interface Window {
    cardano?: Record<string, Cip30Initial | undefined>;
  }
}

interface WalletState {
  installed: InstalledWallet[];
  /** Evolution signing client (Koios provider + CIP-30 wallet). Null when disconnected. */
  client: SigningClient | null;
  /** Raw CIP-30 API — for the rare direct calls (reward addresses, etc.). */
  walletApi: WalletApi | null;
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

function installedWallets(): InstalledWallet[] {
  if (typeof window === "undefined" || !window.cardano) return [];
  return Object.entries(window.cardano)
    .filter((entry): entry is [string, Cip30Initial] => typeof entry[1]?.enable === "function")
    .map(([id, w]) => ({ id, name: w.name ?? id, icon: w.icon ?? "" }));
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [installed, setInstalled] = useState<InstalledWallet[]>([]);
  const [client, setClient] = useState<SigningClient | null>(null);
  const [walletApi, setWalletApi] = useState<WalletApi | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const connect = useCallback(async (id: string) => {
    setConnecting(true);
    try {
      const initial = window.cardano?.[id];
      if (!initial) throw new Error(`${id} wallet not installed`);
      const api = await initial.enable();
      const { makeSigningClient, bech32FromHexAddress } = await import("@/lib/evolution");
      const changeAddress = bech32FromHexAddress(await api.getChangeAddress());
      setWalletApi(api);
      setClient(makeSigningClient(api));
      setWalletName(id);
      setAddress(changeAddress);
      localStorage.setItem("adawatch.wallet", id);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setClient(null);
    setWalletApi(null);
    setWalletName(null);
    setAddress(null);
    localStorage.removeItem("adawatch.wallet");
  }, []);

  useEffect(() => {
    // wallet extensions inject asynchronously — scan now and shortly after load
    setInstalled(installedWallets());
    const late = setTimeout(() => setInstalled(installedWallets()), 400);
    const remembered = localStorage.getItem("adawatch.wallet");
    if (remembered && window.cardano?.[remembered]) {
      connect(remembered).catch(() => localStorage.removeItem("adawatch.wallet"));
    }
    return () => clearTimeout(late);
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
        const initial = window.cardano?.[walletName];
        if (!initial) return;
        // re-enable is cheap when already authorized and survives account switches
        const fresh = await initial.enable();
        const { makeSigningClient, bech32FromHexAddress } = await import("@/lib/evolution");
        const current = bech32FromHexAddress(await fresh.getChangeAddress());
        if (current && current !== address) {
          setWalletApi(fresh);
          setClient(makeSigningClient(fresh));
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
    <WalletCtx.Provider value={{ installed, client, walletApi, walletName, address, connecting, connect, disconnect }}>
      {children}
    </WalletCtx.Provider>
  );
}
