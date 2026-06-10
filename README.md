# PayParity

**Prove fair pay. Expose nothing.**

PayParity is a confidential salary-benchmarking dApp built on Fully Homomorphic Encryption (FHE). Employees submit their salary fully encrypted; anyone can see role-based salary benchmarks without any individual salary ever being revealed.

Built for the Zama Developer Program — Season 3 (Builder Track), on the theme of composable privacy: public aggregates over private individual data.

## Live

- **App:** https://payparity-gilt.vercel.app
- **Contract (verified, Sepolia):** [`0xE48C7CcEB4dA68FA71ccEB94a7d8146Ba4a62523`](https://sepolia.etherscan.io/address/0xE48C7CcEB4dA68FA71ccEB94a7d8146Ba4a62523#code)

## Why it matters

As pay-transparency laws expand (e.g. the EU Pay Transparency Directive), companies must prove they pay fairly without leaking individual salaries — and employees cannot compare pay without exposing themselves. PayParity is the private rail for that: provable fairness, zero individual exposure.

## How it works (the FHE design)

1. **Encrypted submission.** A salary is encrypted in the browser and sent on-chain as an `euint32`. The contract never sees the plaintext value.
2. **Encrypted aggregation.** Each role+level category stores an encrypted running **sum** (`FHE.add`) plus a **public count**. FHE is kept to reliable addition only.
3. **On-chain privacy threshold.** The average cannot be revealed until a category has at least **5** submissions — enforced in the contract, not the UI:
   ```solidity
   require(cat.count >= PRIVACY_THRESHOLD, "PayParity: below privacy threshold");
   ```
   So no individual salary can ever be reverse-engineered.
4. **Aggregate-only reveal.** Only the encrypted *sum* is ever decrypted (never an individual). The average is computed off-chain after reveal (`sum / count`).

`categoryId = roleId * 10 + levelId`, computed off-chain.

## Tech stack

- **Contract:** Solidity `^0.8.24`, `@fhevm/solidity` (FHE, `euint32`), Hardhat
- **Network:** Ethereum Sepolia
- **Frontend:** Next.js 15, wagmi, viem, RainbowKit, `@zama-fhe/react-sdk`
- **Deploy:** Vercel

## Local development

```bash
# contract
cd payparity
npm install
npx hardhat test
npx hardhat deploy --network sepolia --tags PayParity

# frontend
cd payparity-frontend/packages/nextjs
pnpm install
pnpm dev
```

The frontend needs `NEXT_PUBLIC_ALCHEMY_API_KEY` in `.env.local` (and in the Vercel project for production).

## Security

- The 5-submission privacy threshold is enforced on-chain via `require` — a sub-threshold reveal reverts.
- Decryption permission is granted only through `allowReveal`, which itself checks the threshold; submitting a salary never grants per-user decrypt access.
- Only aggregate sums are ever decryptable, never individual values.

## License

MIT — see [LICENSE](./LICENSE).
