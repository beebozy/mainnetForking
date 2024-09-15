import { HardhatUserConfig } from "hardhat/config";
import { vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const ALCHEMY_MAINNET_API_KEY_URL = vars.get("ALCHEMY_MAINNET_API_KEY_URL");
//const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY;

const ACCOUNT_PRIVATE_KEY= vars.get("ACCOUNT_PRIVATE_KEY");

module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      forking: {
        url: ALCHEMY_MAINNET_API_KEY_URL,
      }
    }
  },
  lockGasLimit: 200000000000,
  gasPrice: 10000000000,
};