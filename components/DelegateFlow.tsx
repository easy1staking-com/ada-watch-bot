"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useWallet } from "@/components/WalletContext";
import StatusBanner from "@/components/StatusBanner";
import { classifyError, FriendlyError } from "@/lib/errors";

export const EASY1_POOL_ID = "pool1yr0cv3dtmhcfgqa6yetvmf769ngk89e6tepecmjrmjl2jzcw2lm";

type Stage =
  | "no-wallet"
  | "checking"
  | "already"
  | "ready"          // delegated elsewhere or undelegated-but-registered
  | "ready-register" // stake key not registered yet (needs reg cert + 2 ada deposit)
  | "signing"
  | "waiting"
  | "done"
  | "error";

function fireConfetti() {
  const colors = ["#2AABEE", "#3b82f6", "#F070D0", "#5C34DF", "#ffffff", "#34d399"];
  for (let i = 0; i < 140; i++) {
    const piece = document.createElement("div");
    const size = 6 + Math.random() * 8;
    piece.style.cssText = `position:fixed;top:-20px;left:${Math.random() * 100}vw;width:${size}px;height:${size * 0.6}px;background:${colors[i % colors.length]};z-index:9999;border-radius:2px;pointer-events:none;transform:rotate(${Math.random() * 360}deg);`;
    document.body.appendChild(piece);
    const fall = piece.animate(
      [
        { transform: piece.style.transform, opacity: 1 },
        { transform: `translateY(${window.innerHeight + 60}px) rotate(${720 + Math.random() * 720}deg) translateX(${(Math.random() - 0.5) * 240}px)`, opacity: 0.9 },
      ],
      { duration: 2800 + Math.random() * 2200, delay: Math.random() * 900, easing: "cubic-bezier(.2,.6,.4,1)" },
    );
    fall.onfinish = () => piece.remove();
  }
}

export default function DelegateFlow() {
  const { client, walletApi, address } = useWallet();
  const [stage, setStage] = useState<Stage>("no-wallet");
  const [error, setError] = useState<FriendlyError | null>(null);
  const stakeRef = useRef<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const check = useCallback(async () => {
    if (!client || !walletApi) {
      setStage("no-wallet");
      return;
    }
    setStage("checking");
    try {
      const { stakeBech32FromHex } = await import("@/lib/evolution");
      const rewardAddresses = await walletApi.getRewardAddresses();
      if (!rewardAddresses?.length) throw new Error("wallet exposes no stake address");
      stakeRef.current = stakeBech32FromHex(rewardAddresses[0]);
      const res = await fetch(`/api/account?stake=${stakeRef.current}`);
      if (!res.ok) throw new Error(`account lookup failed (${res.status})`);
      const account: { active: boolean; pool_id: string | null } = await res.json();
      if (account.pool_id === EASY1_POOL_ID) {
        setStage("already");
        fireConfetti();
      } else if (account.active) {
        setStage("ready");
      } else {
        setStage("ready-register");
      }
    } catch (e) {
      setError(classifyError(e));
      setStage("error");
    }
  }, [client, walletApi]);

  useEffect(() => {
    check();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [check]);

  const delegate = async () => {
    if (!client || !address || !stakeRef.current) return;
    setError(null);
    setStage("signing");
    try {
      const { PoolKeyHash } = await import("@evolution-sdk/evolution");
      const { stakeKeyOf } = await import("@/lib/evolution");
      const stakeCredential = stakeKeyOf(address);
      const poolKeyHash = PoolKeyHash.fromBech32(EASY1_POOL_ID);

      const builder = client.newTx();
      if (stage === "ready-register") {
        // Conway combined certificate: register + delegate in one go (2 ada deposit)
        builder.registerAndDelegateTo({ stakeCredential, poolKeyHash });
      } else {
        builder.delegateToPool({ stakeCredential, poolKeyHash });
      }
      const built = await builder.build();
      await (await built.sign()).submit();
      setStage("waiting");
      // poll until the chain reflects the new delegation
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/account?stake=${stakeRef.current}`);
          const account = await res.json();
          if (account.pool_id === EASY1_POOL_ID) {
            if (pollRef.current) clearInterval(pollRef.current);
            setStage("done");
            fireConfetti();
            setTimeout(fireConfetti, 1200);
          }
        } catch {
          /* keep polling */
        }
      }, 10_000);
    } catch (e) {
      setError(classifyError(e));
      setStage("error");
    }
  };

  return (
    <div className="glass rounded-3xl p-8 text-center sundae-ring">
      {stage === "no-wallet" && (
        <>
          <p className="text-3xl">👛</p>
          <p className="text-white/60 mt-3 text-sm">
            Connect your wallet (top-right) and we&apos;ll check where you&apos;re delegating.
          </p>
        </>
      )}

      {stage === "checking" && <p className="text-white/50 text-sm animate-pulse">Checking your delegation…</p>}

      {stage === "already" && (
        <>
          <p className="text-4xl">❤️</p>
          <h2 className="text-2xl font-extrabold text-white mt-3">You&apos;re already one of us!</h2>
          <p className="text-white/55 mt-2 text-sm">
            This wallet delegates to EASY1 — you are literally keeping Ada Watch free right now.
            Thank you.
          </p>
        </>
      )}

      {(stage === "ready" || stage === "ready-register") && (
        <>
          <p className="text-3xl">🤝</p>
          <h2 className="text-xl font-extrabold text-white mt-3">Delegate to EASY1</h2>
          <p className="text-white/55 mt-2 text-sm">
            {stage === "ready-register"
              ? "Your stake key isn't registered yet — this transaction registers it (2 ada refundable deposit) and delegates in one go."
              : "One transaction, same rewards as any healthy pool, and Ada Watch stays free for everyone."}
          </p>
          <button onClick={delegate} className="tg-btn px-8 py-3.5 rounded-full font-bold hover:opacity-90 mt-5">
            Delegate now
          </button>
        </>
      )}

      {stage === "signing" && <p className="text-white/50 text-sm animate-pulse">Waiting for your signature…</p>}

      {stage === "waiting" && (
        <>
          <p className="text-3xl animate-pulse">⏳</p>
          <p className="text-white/55 mt-3 text-sm">
            Submitted! Waiting for the chain to confirm — this usually takes under a minute.
          </p>
        </>
      )}

      {stage === "done" && (
        <>
          <p className="text-5xl">🎉</p>
          <h2 className="text-3xl font-extrabold text-white mt-3">THANK YOU!</h2>
          <p className="text-white/60 mt-3 text-sm max-w-sm mx-auto">
            You just became part of what keeps Ada Watch free for every Cardano user. Rewards
            flow from the next epochs as usual — and the bot keeps watching, 24/7. 🥂
          </p>
        </>
      )}

      {stage === "error" && (
        <>
          {error && (
            <div className="text-left">
              <StatusBanner message={error} />
            </div>
          )}
          <button onClick={check} className="glass text-sm font-bold px-5 py-2.5 rounded-full hover:bg-white/10 mt-4">
            Try again
          </button>
        </>
      )}
    </div>
  );
}
