import { impersonateAccount } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { error } from "console";
import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const USDC_ADRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    //const ETH_ADDRESS=
    const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const HOLDER_ADRESS = "0x7713974908Be4BEd47172370115e8b1219F4A5f0";


    await impersonateAccount(HOLDER_ADRESS);

    const impersonatedSigner = await ethers.getSigner(HOLDER_ADRESS);
    const USDC_Contract = await ethers.getContractAt("IERC20", USDC_ADRESS, impersonatedSigner);
    const WETH_Contract = await ethers.getContractAt("IERC20", WETH_ADDRESS, impersonatedSigner);
    const ROUTER_CONTRACT_ADDRESS = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS, impersonatedSigner);

    const amountInMax = ethers.parseUnits("10000", 6);
    const amountOut = ethers.parseEther("2");
    const deadline = Math.floor((Date.now() / 1000 + (60 + 5)));

    console.log("************************************************")
    const usdcBalanceBefore = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const ethBalanceBefore = await ethers.provider.getBalance(impersonatedSigner.address);
    console.log("USDC Balance before ::", ethers.formatUnits(usdcBalanceBefore, 6));
    console.log("************************************************");
    console.log("WETH Balance before ::", ethers.formatEther(ethBalanceBefore));
    await USDC_Contract.approve(ROUTER_CONTRACT_ADDRESS, amountInMax);

    await ROUTER_CONTRACT_ADDRESS.swapTokensForExactETH(
        amountOut,
        amountInMax,
        [USDC_ADRESS, WETH_ADDRESS],
        impersonatedSigner.address,
        deadline
    )


    /*
     function swapTokensForExactETH(
            uint amountOut, uint amountInMax,
            address[] calldata path,
            address to, uint deadline
        ) 
    
    
    */



}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
