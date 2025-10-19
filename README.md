# 🔐 Encrypted Survey dApp

A blockchain-based privacy-preserving survey platform built with React + Ethers.js + Solidity.

## Features

- 🔒 **Privacy Protection**: Uses encryption technology to protect user responses
- 🌐 **Decentralized**: Based on Ethereum smart contracts
- 📊 **Real-time Statistics**: Automatic aggregation of survey results
- 🎨 **Modern Interface**: Responsive design with user-friendly experience

## Technology Stack

- **Frontend**: React 18, Vite, Ethers.js v6
- **Smart Contracts**: Solidity, Hardhat
- **Network**: Sepolia Testnet
- **Deployment**: Vercel

## Local Development

### Prerequisites

- Node.js 16+
- MetaMask Wallet
- Sepolia Testnet ETH

### Install Dependencies

```bash
# Install project dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

### Environment Configuration

1. Copy environment variable files:
```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
```

2. Configure environment variables:
```bash
# .env
SEPOLIA_RPC_URL=your_sepolia_rpc_url
PRIVATE_KEY=your_private_key

# frontend/.env
VITE_CONTRACT_ADDRESS=deployed_contract_address
```

### Run the Project

```bash
# Start frontend development server
cd frontend
npm run dev
```

Visit http://localhost:4002

## Smart Contract

Contract deployed to Sepolia Testnet:
- Address: `0x20F2dbbF57d4B421dF8CEfBaC3C55e2cB5Cc2096`
- Network: Sepolia Testnet

### Contract Functions

- `createSurvey()`: Create new survey
- `addQuestion()`: Add questions
- `submitResponse()`: Submit responses
- `getQuestionResult()`: Get result statistics

## Deployment

### GitHub Deployment

1. Create GitHub repository
2. Push code to repository
3. Connect to Vercel

### Vercel Deployment

1. Import GitHub repository in Vercel
2. Configure environment variables:
   - `VITE_CONTRACT_ADDRESS`: Smart contract address
3. Deploy complete

## Usage Instructions

1. **Connect Wallet**: Click "Connect Wallet" to connect MetaMask
2. **Switch Network**: Ensure connection to Sepolia Testnet
3. **Create Survey**: Fill in survey information and questions
4. **Take Survey**: Select survey and submit responses
5. **View Results**: View statistical results after survey ends

## Project Structure

```
├── contracts/              # Smart contracts
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utility functions
├── scripts/                # Deployment scripts
└── test/                   # Test files
```

## Contributing

Issues and Pull Requests are welcome!

## License

MIT License
