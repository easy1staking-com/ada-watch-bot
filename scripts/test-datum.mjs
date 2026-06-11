/**
 * Golden-vector check for the TS PlutusData encoder + datum builder against the
 * vectors verified on mainnet by the Java side. Run: node scripts/test-datum.mjs
 */
import { buildStrategyOrderDatum, encodeExtension, plutusHex } from "../lib/sundae.compiled.mjs";

let failed = 0;
const check = (name, actual, expected) => {
  if (actual === expected) {
    console.log(`✓ ${name}`);
  } else {
    failed++;
    console.error(`✗ ${name}\n  expected ${expected}\n  actual   ${actual}`);
  }
};

// 1. The REAL deployed strategy datum (mainnet tx 965398a8…#0) — Fixed destination,
//    HOSKY pool, SDK void extension bytes (d87980)
check(
  "mainnet deployed datum (Fixed + pinned)",
  buildStrategyOrderDatum({
    poolIdent: "455422de9777d248aaaa71da9e17f67ddb6e003aadea1f4f97d24ddd",
    ownerKeyHash: "a6ef3723095d6b1039f534e6f86453b51dc1493d9ba955e185710762",
    maxProtocolFee: 1_280_000n,
    destination: {
      paymentKeyHash: "bd63a074d52fb1761455937d0fa2bb2f1a15088efef45e2c72524994",
      stakeKeyHash: "a6ef3723095d6b1039f534e6f86453b51dc1493d9ba955e185710762",
    },
    signerVkey: "3b46bf6a6185a49c508dfed020bb8d153c4809731171baf492f2795d3d2c083d",
    extension: new Uint8Array([0xd8, 0x79, 0x80]),
  }),
  "d8799fd8799f581c455422de9777d248aaaa71da9e17f67ddb6e003aadea1f4f97d24dddffd8799f581ca6ef3723095d6b1039f534e6f86453b51dc1493d9ba955e185710762ff1a00138800d8799fd8799fd8799f581cbd63a074d52fb1761455937d0fa2bb2f1a15088efef45e2c72524994ffd8799fd8799fd8799f581ca6ef3723095d6b1039f534e6f86453b51dc1493d9ba955e185710762ffffffffd87980ffd8799fd8799f58203b46bf6a6185a49c508dfed020bb8d153c4809731171baf492f2795d3d2c083dffff43d87980ff",
);

// 2. Self + any-market: pool_ident None (d87a80...) and destination Self (d87a80)
const selfDatum = buildStrategyOrderDatum({
  ownerKeyHash: "a6ef3723095d6b1039f534e6f86453b51dc1493d9ba955e185710762",
  maxProtocolFee: 1_280_000n,
  signerVkey: "3b46bf6a6185a49c508dfed020bb8d153c4809731171baf492f2795d3d2c083d",
  extension: encodeExtension({ kind: "manual", strategyId: new Uint8Array(8).fill(7) }),
});
check(
  "Self + any-market datum shape",
  selfDatum.startsWith("d8799fd87a80d8799f581ca6ef") && selfDatum.includes("d87a80d8799fd8799f5820") ? "ok" : selfDatum,
  "ok",
);

// 3. Extension wire format
check(
  "manual extension bytes",
  plutusHex({ bytes: encodeExtension({ kind: "manual", strategyId: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]) }) }),
  "4c" + "41570100" + "0102030405060708",
);

process.exit(failed === 0 ? 0 : 1);
