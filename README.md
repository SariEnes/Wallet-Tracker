<div align="center">

# ⭐ Stellar Insight

### Multi-Wallet Dashboard for the Stellar Network

[![Stellar](https://img.shields.io/badge/Stellar-Testnet-blue?logo=stellar)](https://stellar.org)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

*Track multiple Stellar wallets in one place — no wallet connection required.*

</div>

---

## 📖 Project Description

Stellar Insight is a read-only multi-wallet dashboard built on the Stellar blockchain. It allows users to paste multiple wallet addresses — both Classic (`G...`) and Contract (`C...`) — into a single text field and instantly view balances, tokens, NFTs, and transaction histories. No wallet connection is needed for quick lookups, making it safe and accessible for everyone.

For users who want a persistent experience, Freighter wallet authentication lets them save addresses into custom watchlists, give nicknames to wallets, and access their data from any device. Live USD pricing is powered by CoinGecko. The app never sends transactions — it only reads data, keeping security risks at zero.

---

## 🔭 Vision

Managing multiple Stellar wallets shouldn't be a hassle. Most existing tools require you to connect your wallet just to check a balance, which introduces unnecessary security risks. Stellar Insight takes a different approach — read-only by design.

Our goal is to become the go-to monitoring tool for Stellar ecosystem users who juggle multiple wallets for airdrops, investments, and trading. Looking ahead, we plan to introduce real-time alerts for large transactions, portfolio analytics with historical charts, and eventually cross-chain support to track assets beyond Stellar.

---

## ⚙️ Features

- **Bulk Wallet Scanning** — Paste multiple addresses at once, even mixed with random text. The parser extracts valid Stellar addresses automatically.
- **No Connection Required** — Check any wallet instantly without connecting your own.
- **Live Balances & Prices** — XLM and token balances with real-time USD values via CoinGecko.
- **Transaction History** — View recent operations for any wallet with pagination.
- **Token & NFT Display** — See all assets held by each wallet.
- **Freighter Authentication** — Sign in with Freighter to unlock persistent features.
- **Custom Watchlists** — Organize wallets into named lists like "Airdrops", "Investments", "Trading".
- **Wallet Nicknames** — Label each address for easy identification.
- **Dark Mode** — Sleek dark UI as default.
- **Responsive Design** — Works on mobile, tablet, and desktop.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Blockchain SDK | @stellar/stellar-sdk v11+ |
| Data Source | Stellar Horizon API (Testnet) |
| Wallet Auth | Freighter (@stellar/freighter-api) |
| Backend / DB | Supabase |
| Price Feed | CoinGecko API |
| Styling | Tailwind CSS (Dark Mode) |

---

## 📋 Software Development Plan

**Step 1 — Project Setup & Core UI**
Initialize Next.js project with TypeScript and Tailwind CSS. Set up dark mode, root layout, header with logo, and the main address input textarea component.

**Step 2 — Stellar Integration & Data Fetching**
Implement the bulk address parser (regex for `G...` and `C...` addresses). Connect to Stellar Horizon Testnet API. Fetch account balances, tokens, and validate addresses using `StrKey`. Use `Promise.allSettled` for parallel fetching.

**Step 3 — Dashboard UI & Detail Panel**
Build responsive wallet card grid with skeleton loading states. Create the slide-out detail panel with tabs for Tokens, NFTs, and Transaction History. Implement cursor-based pagination for transactions.

**Step 4 — Price Integration**
Integrate CoinGecko API for live XLM/USD pricing. Add 60-second cache with auto-refresh. Display USD values on cards and compute total portfolio value.

**Step 5 — Auth & Watchlist System**
Implement Freighter wallet authentication. Set up Supabase with profiles, watchlists, and saved_wallets tables with Row Level Security. Build watchlist CRUD operations with nickname support.

**Step 6 — Deployment**
Polish UI/UX with animations and toast notifications. Optimize performance. Deploy to Vercel. Configure environment variables for production.

---

## 🚀 Installation

### Prerequisites

- Node.js 18+
- npm
- [Freighter Wallet](https://www.freighter.app/) browser extension
- [Supabase](https://supabase.com/) account (free tier)

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/stellar-insight.git
cd stellar-insight

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

Fill in your `.env.local`:

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
```

### Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE profiles (
  public_key TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE watchlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES profiles(public_key) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Watchlist',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE saved_wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  watchlist_id UUID REFERENCES watchlists(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  nickname TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(watchlist_id, address)
);
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
stellar-insight/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/
│   │   ├── layout/             # Header, Footer
│   │   ├── wallet/             # WalletCard, WalletGrid, WalletDetail
│   │   ├── watchlist/          # WatchlistSidebar, WatchlistPanel
│   │   └── auth/               # ConnectButton (Freighter)
│   ├── lib/
│   │   ├── stellar/            # SDK client, accounts, transactions, parser
│   │   ├── pricing/            # CoinGecko integration
│   │   └── supabase/           # Auth, watchlists, wallets CRUD
│   ├── hooks/                  # useWalletData, useAuth, usePrices, useWatchlists
│   └── types/                  # TypeScript interfaces
├── .env.local
├── tailwind.config.ts
└── package.json
```

---

## 🧑‍💻 About Me

**Enes** — Student from Izmir, Turkey

I'm passionate about software development, crypto, and entrepreneurship. I've been in the blockchain space for a few years, initially drawn to the NFT sector. This year I started actively developing, and Stellar Insight is one of the first projects I'm building from scratch.

The idea came from a simple frustration: I had multiple wallets and was tired of checking them one by one. So I built a tool that does it all in one screen. Sometimes the best projects come from solving your own problems.

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
