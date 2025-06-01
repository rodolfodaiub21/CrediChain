require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: ["8c6266ee3102abb0ed88d58a7c4fddb529bd368e1b10ac38456f6b308d5fbc48"],
    },
  },
};