import { impersonateAccount } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { error } from "console";
import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const USDC_ADRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    //const ETH_ADDRESS=
    const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

    const LP_TOKEN = "0x3041cbd36888becc7bbcbc0045e3b1f144466f5f";
    const HOLDER_ADRESS = "0x7713974908Be4BEd47172370115e8b1219F4A5f0";


    await impersonateAccount(HOLDER_ADRESS);

    const impersonatedSigner = await ethers.getSigner(HOLDER_ADRESS);
    const USDC_Contract = await ethers.getContractAt("IERC20", USDC_ADRESS, impersonatedSigner);
    const USDT_ADDRESS_Contract = await ethers.getContractAt("IERC20", USDT_ADDRESS, impersonatedSigner);
    const ROUTER_CONTRACT_ADDRESS = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS, impersonatedSigner);
    const LP_CONTRACT_ADRESS = await ethers.getContractAt("IERC20", LP_TOKEN, impersonatedSigner);
    /* uint amountADesired,
         uint amountBDesired,
         uint amountAMin,
         uint amountBMin,
         */

    const amountADesired = ethers.parseUnits("100", 6);
    const amountBDesired = ethers.parseUnits("100", 6);
    const amountAMin = ethers.parseUnits("50", 6);
    const amountBMin = ethers.parseUnits("50", 6);
    const deadline = Math.floor((Date.now() / 1000 + (60 * 5)));

    console.log("************************************************")
    const usdcBalanceBefore = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const usdtbalanceBefore = await USDT_ADDRESS_Contract.balanceOf(impersonatedSigner.address);
    console.log("USDC Balance before ::", ethers.formatUnits(usdcBalanceBefore, 6));
    console.log("************************************************");
    console.log("USDT Balance before ::", ethers.formatUnits(usdtbalanceBefore, 6));

    await USDC_Contract.approve(ROUTER_CONTRACT_ADDRESS, amountADesired);
    await USDT_ADDRESS_Contract.approve(ROUTER_CONTRACT_ADDRESS, amountBDesired);

    await ROUTER_CONTRACT_ADDRESS.addLiquidity(
        USDC_ADRESS,
        USDT_ADDRESS,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        impersonatedSigner.address,
        deadline
    )

    const usdcBalanceAfter = await USDC_Contract.balanceOf(impersonatedSigner);
    const usdt_BalanceAfter = await USDT_ADDRESS_Contract.balanceOf(impersonatedSigner);
    const lp_balance = await LP_CONTRACT_ADRESS.balanceOf(impersonatedSigner);
    console.log("********************************")
    console.log("USDC balance after::", usdcBalanceAfter);
    console.log("USDT balance after_", usdt_BalanceAfter);
     console.log("LP Balance before ::", ethers.formatUnits(lp_balance, 18));

    await LP_CONTRACT_ADRESS.approve(ROUTER_CONTRACT_ADDRESS,lp_balance);
    /*
     address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    */
    await ROUTER_CONTRACT_ADDRESS.removeLiquidity(
        USDC_ADRESS,
        USDT_ADDRESS,
        lp_balance,
        amountAMin,
        amountBMin,
        impersonatedSigner.address,
        deadline

    )

    const usdcBalanceAfterLiquidity = await USDC_Contract.balanceOf(impersonatedSigner);
    const usdt_BalanceAfterAfterliquidity = await USDT_ADDRESS_Contract.balanceOf(impersonatedSigner);
    const lp_balanceAfterLiquidity = await LP_CONTRACT_ADRESS.balanceOf(impersonatedSigner);
    console.log("********************************")
    console.log("USDC balance after::", usdcBalanceAfterLiquidity);
    console.log("USDT balance after_", usdt_BalanceAfterAfterliquidity);
     console.log("LP Balance before ::", ethers.formatUnits(lp_balance, 18));

   
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
