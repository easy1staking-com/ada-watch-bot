# Ada Watch Bot Privacy Policy

**Last Updated: May 22, 2026**

This Privacy Policy explains how Ada Watch Bot ("we," "us," or "our") collects,
uses, and protects information when you use Ada Watch Bot ("the Bot"), a bot
available on Discord and Telegram that tracks Cardano wallet activity, DeFi
positions on Liqwid Finance, Indigo Protocol, and FluidTokens Lending, and NFT
marketplace events on JPG Store. By using the Bot, you agree to this Privacy
Policy and our [Terms of Service](#terms-of-service).

## 1. Information We Collect

We collect the minimum information needed to operate the Bot.

### a. Information You Provide

- **Platform user identifier**: your Discord user ID or Telegram chat ID, used to
  identify you and route notifications.
- **Cardano wallet addresses**: the public addresses you submit via `/add` to
  track on-chain activity, DeFi positions, and NFT events. Ada Handles
  (`$yourhandle`) are resolved to their underlying addresses at the time of use.

### b. Automatically Collected Information

- **Blockchain data**: publicly available data from the Cardano blockchain
  (transactions, UTxOs, datums, NFT ownership, oracle prices) accessed via a
  Cardano node and supplementary indexers. The Bot reads this data continuously;
  beyond a small cache of token metadata (name, ticker, decimals), it is not
  stored.
- **Usage data**: lightweight server-side logs of commands issued and timestamps,
  retained for debugging and performance monitoring.

### c. Non-Personally Identifiable Information

We may aggregate or anonymise data (e.g., usage statistics) that cannot be used
to identify you.

**We do not collect or store any other personal information**, such as names,
email addresses, or private keys.

## 2. How We Use Your Information

We use your information to:

- Provide the Bot's core functionality — tracking wallet activity, computing
  DeFi position health, and delivering notifications.
- Debug and improve the Bot's performance.
- Ensure security and prevent abuse.
- Comply with legal obligations under Irish and EU law (e.g., GDPR).

## 3. Data Accuracy and Responsibility

As stated in our Terms of Service, we are not responsible for incorrect,
incomplete, or malformed data retrieved from the Cardano blockchain, the
Cardano node, Liqwid Finance, Indigo Protocol, FluidTokens, JPG Store, or any
oracle feed. You are solely responsible for verifying and acting on the data
the Bot surfaces.

## 4. How We Share Your Information

We do not sell, rent, or share your personal information, except:

- **With third-party services**:
    - **Discord** — to process commands and deliver responses (subject to
      Discord's Privacy Policy: https://discord.com/privacy).
    - **Telegram** — to process commands and deliver responses (subject to
      Telegram's Privacy Policy: https://telegram.org/privacy).
    - **Cardano node and chain indexers** — to retrieve public blockchain data
      (no personal data sent).
    - **Liqwid Finance, Indigo Protocol, FluidTokens, JPG Store** — public APIs
      and on-chain data we read to compute health metrics and event notifications,
      subject to each protocol's own policies.
- **For legal reasons** — to comply with applicable laws, respond to legal
  requests, or protect our rights.
- **In aggregated form** — anonymised data may be used for analytics.

## 5. Blockchain Data

Cardano blockchain data (wallet addresses, transactions, UTxO content) is public
and pseudonymous, and is not generally considered personal data under GDPR. We
retrieve this data in real time and do not store it beyond what is needed for
operational caching (e.g., a small token metadata cache).

## 6. Data Storage and Security

- **Storage**: we store only your platform user identifier (Discord user ID or
  Telegram chat ID), the Cardano wallet addresses you have asked us to watch,
  and lightweight per-user state needed to deduplicate notifications. Data
  lives in a secure, encrypted database hosted in the EU.
- **Security**: we use industry-standard measures (encryption at rest, access
  controls) to protect stored data. No system is perfectly secure; you share
  data at your own risk.
- **Retention**: we retain your data only as long as needed to provide the
  Bot's services or comply with legal requirements. Data is deleted on request
  or when you remove yourself from the watchlist via `/remove`. If our
  notification delivery system detects that a user has explicitly disabled DMs
  or blocked the bot on a given platform, the associated watching addresses are
  automatically purged.

## 7. Your Rights (GDPR and Irish Law)

Under GDPR and Irish data protection law, you may have rights to:

- Access, correct, or delete your personal information (platform user ID,
  wallet addresses).
- Object to or restrict data processing.
- Request data portability.

To exercise these rights, contact us at **info.easy1staking@gmail.com**. Note
that blockchain data cannot be modified or deleted due to its immutable nature.

## 8. Data Deletion

To stop data collection on a given platform, remove the Bot from your Discord
server or block it on Telegram. To request deletion of stored data (platform
user ID, wallet addresses), email **info.easy1staking@gmail.com**. We respond
within 30 days, as required by GDPR.

## 9. Third-Party Services

The Bot relies on:

- **Discord** — subject to Discord's Privacy Policy.
- **Telegram** — subject to Telegram's Privacy Policy.
- **Cardano node and indexers** — public blockchain data, no additional privacy
  policy applies.
- **Liqwid Finance, Indigo Protocol, FluidTokens, JPG Store** — subject to
  their privacy policies.

We are not responsible for the practices of these third parties.

## 10. International Data Transfers

Your data (platform user ID, wallet addresses) is processed in Ireland or the
EU. If transferred outside the EU (e.g., to Discord's or Telegram's
infrastructure), we ensure compliance with GDPR requirements.

## 11. Children's Privacy

The Bot is not intended for users under 18. We do not knowingly collect
personal information from minors. If you believe we have such data, contact us
at **info.easy1staking@gmail.com**.

## 12. Contact Us

For questions, concerns, or to exercise your rights, contact us at:

- Email: **info.easy1staking@gmail.com**

By using Ada Watch Bot, you acknowledge that you have read and understood this
Privacy Policy.
