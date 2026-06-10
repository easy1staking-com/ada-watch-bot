export default function PhoneMock() {
  return (
    <div className="iphone justify-self-center">
      <div className="island" />
      <div className="screen">
        {/* status bar */}
        <div className="flex justify-between items-center px-7 pt-4 pb-1 text-[11px] text-white/80 font-semibold">
          <span>9:41</span>
          <span>▮▮▮ ᯤ 🔋</span>
        </div>
        {/* telegram header */}
        <div className="tg-header flex items-center gap-3 px-4 py-2.5 border-b border-black/30">
          <span className="text-sky-400 text-sm">‹</span>
          <span className="w-8 h-8 rounded-full tg-btn grid place-items-center text-sm">👁</span>
          <div className="leading-tight">
            <p className="text-[13px] font-bold text-white">Ada Watch Bot</p>
            <p className="text-[10px] text-sky-400">bot</p>
          </div>
        </div>
        {/* chat */}
        <div className="flex-1 px-3 py-3 space-y-2.5 text-[12px] overflow-hidden">
          <div className="bubble-bot p-3 max-w-[85%]">
            <p>
              ⚠️ <b>FluidTokens loan</b>
              <br />
              CR dropped to <b className="text-amber-400">118%</b> — getting close to liquidation.
            </p>
            <p className="text-[9px] text-white/30 mt-1 text-right">22:47</p>
          </div>
          <div className="bubble-bot p-3 max-w-[85%]">
            <p>
              🤖 <b>Strategy executed</b>
              <br />
              Swapped <b className="text-emerald-400">5 ₳ → 120,011,375 HOSKY</b> 🐶
              <br />
              <span className="text-white/40">change 3.72 ₳ returned to your wallet</span>
            </p>
            <p className="text-[9px] text-white/30 mt-1 text-right">22:53</p>
          </div>
          <div className="bubble-bot p-3 max-w-[85%]">
            <p>
              ⚡ <b>Your vault</b> · 10 ₳ armed
              <br />
              <span className="text-white/40">a4e581…#0 · tradeable 6.72 ₳</span>
            </p>
            <div className="grid grid-cols-3 gap-1.5 mt-2">
              <button className="kb-btn rounded-lg py-1.5 font-semibold">🐶 HOSKY</button>
              <button className="kb-btn rounded-lg py-1.5 font-semibold">🐍 SNEK</button>
              <button className="kb-btn rounded-lg py-1.5 font-semibold">💵 USDM</button>
            </div>
            <button className="kb-btn w-full rounded-lg py-1.5 font-semibold mt-1.5 !text-rose-300 !border-rose-400/30 !bg-rose-400/10">
              ✕ Cancel &amp; withdraw
            </button>
          </div>
        </div>
        {/* input bar */}
        <div className="tg-header px-3 py-2.5 flex items-center gap-2 border-t border-black/30">
          <span className="text-white/30 text-sm">📎</span>
          <div className="flex-1 bg-[#0e1621] rounded-full px-3 py-1.5 text-[11px] text-white/30">Message…</div>
          <span className="text-sky-400">🎤</span>
        </div>
      </div>
    </div>
  );
}
