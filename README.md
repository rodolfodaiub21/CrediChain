# CrediChain

CrediChain is a decentralized lending platform where users can request and fund loans securely and transparently using blockchain technology. The system incentivizes responsible financial behavior by updating users' credit scores based on their repayment activity. By leveraging smart contracts on the Ethereum network, CrediChain ensures a trustless, tamper-proof lending experience between peers.

## 🚀 Features

- ✅ Request and repay loans in installments
- 💰 Fund peer loans directly via the blockchain
- 📈 Dynamic credit scoring updated with every repayment
- 🔒 Transparent and secure smart contracts on Ethereum
- ⏱ Simulated loan terms for testing (10-minute intervals between installments)

## 🛠 Technologies

- **Solidity**: for smart contract development
- **Hardhat**: for local development and deployment
- **Ether.js**: for interacting with smart contracts from the frontend
- **React.js**: for the web-based user interface
- **Ganache** or **Hardhat Network**: for local blockchain simulation

## 📄 Smart Contract Overview

The main smart contract, `CreditScore.sol`, includes:

- A `CreditScore` system managed by the backend (owner)
- A `Loan` struct to handle:
  - Loan amount, interest, installments
  - Payment tracking and deadlines
- Functions to:
  - Request a loan
  - Fund a loan
  - Pay installments every 10 minutes (for testing)
  - View available loans and personal loan history

## 💡 How It Works

1. **User requests a loan** with specified amount, interest, and number of installments.
2. **Lender funds the loan** by sending ETH equivalent to the loan amount.
3. **Borrower repays** in regular intervals (10-minute simulated months).
4. **Smart contract tracks repayments**, updating state and credit score.
5. **Verified users can view profile**, repayment history, and lending activity via a web dashboard.

## 📦 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/CrediChain.git
   cd CrediChain
Install dependencies

npm install
Compile the smart contracts


npx hardhat compile
Run a local blockchain


npx hardhat node
Deploy the contract
In a separate terminal:


npx hardhat run scripts/deploy.js --network localhost
Start the frontend


npm start
📚 Future Improvements
Integrate real time-based repayment (e.g., monthly)

Implement penalty logic and credit downgrade for late payments

Add KYC/verification using Firebase

Enable stablecoin integration for real-world use

Add admin analytics dashboard

🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

Disclaimer: This system is currently deployed on a local or test network for demo and educational purposes. Use with real funds is not recommended without a thorough audit.

📧 Contact
Developed by Rodolfo Daiub
📨 Contact: [rodolfodaiub2003@gmail.com]🔗
