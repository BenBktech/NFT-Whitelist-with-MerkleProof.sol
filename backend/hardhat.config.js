require("@nomicfoundation/hardhat-toolbox");
require('hardhat-gas-reporter')
require('dotenv').config();
require('@nomicfoundation/hardhat-verify');
require('solidity-coverage');

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";;
const PRIVATE_KEY = process.env.PRIVATE_KEY  || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY  || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 11155111
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    noColors: true,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.20"
      },
    ]
  }
};
