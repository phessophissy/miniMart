# mintMart 🎨

A collectible minting platform on Stacks (Bitcoin L2) featuring NFTs of varying rarities.

## 🌟 Features

- **5 Rarity Tiers**: Common, Rare, Epic, Legendary, and Ultimate
- **Gas-Optimized Contracts**: Built for lowest transaction fees on Stacks
- **Beautiful UI**: Gold and Black theme with floating animation effects
- **Stacks Connect**: Seamless wallet integration

## 📊 Rarity Details

| Rarity | Supply | Mint Price |
|--------|--------|------------|
| Common | 10,000 | 0.01 STX |
| Rare | 7,500 | 0.035 STX |
| Epic | 5,000 | 0.05 STX |
| Legendary | 1,000 | 0.07 STX |
| Ultimate | 100 | 0.1 STX |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Clarinet (for contract development)
- Stacks wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mintMart.git
cd mintMart

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your private keys

# Start development server
npm run dev
```

## 📁 Project Structure

```
mintMart/
├── contracts/          # Clarity smart contracts
├── frontend/           # Next.js frontend application
├── scripts/            # Deployment and utility scripts
├── wallets/            # Generated wallets (gitignored)
└── assets/             # NFT images and metadata
```

## 🔐 Security

- **Never commit `.env` files**
- **Wallet files are automatically gitignored**
- Private keys should only be stored locally

## 📜 License

MIT License
