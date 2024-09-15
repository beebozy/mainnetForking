import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    const ROUTER_CONTRACT_ADDRESS="0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const USDC="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const DAI="0x6B175474E89094C44Da98b954EedeAC495271d0F";

    const HOLDER_ADRESS="0x7713974908Be4BEd47172370115e8b1219F4A5f0";

    await helpers.impersonateAccount(HOLDER_ADRESS);

    const impersonatedSigner= await ethers.getSigner(HOLDER_ADRESS);

    const USDC_AMOUNT= await ethers.parseUnits("100",6);
    const DAI_AMOUNNT= await ethers.parseUnits("20",18);


    const USDC_Contract= await ethers.getContractAt("IERC20",USDC,impersonatedSigner);
    const DAI_Contract= await ethers.getContractAt("IERC20",DAI);
  
    const ROUTER= await ethers.getContractAt("IUniswapV2Router",ROUTER_CONTRACT_ADDRESS,impersonatedSigner);
   

    const usdc_Balance= await USDC_Contract.balanceOf(impersonatedSigner);
    const dai_Balance=  await DAI_Contract.balanceOf(impersonatedSigner);
    const deadline= Math.floor((Date.now()/1000)+(60 *10));

    console.log("USDC Balance  before transaction : :" ,usdc_Balance );
    console.log("Dai Balance  before transaction : :" ,dai_Balance);
    USDC_Contract.approve(ROUTER,USDC_AMOUNT);
    await ROUTER.swapTokensForExactTokens(
        USDC_AMOUNT,
        DAI_AMOUNNT,
        [USDC, DAI],
        impersonatedSigner.address,
        deadline
    );

    const usdcBalAfter= await USDC_Contract.balanceOf(impersonatedSigner);
    const daiBalAfter= await USDC_Contract.balanceOf(impersonatedSigner);

    console.log("usdc balance after" ,usdcBalAfter);
    console.log("Dai balance after", daiBalAfter);
//    console.log("USDC Balance  after transaction : :" ,usdc_Balance );
  //  console.log("Dai Balance  after transaction : :" ,dai_Balance);
}

    






    /*const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

    const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";

    await helpers.impersonateAccount(TOKEN_HOLDER);
    const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

    const amountOut = ethers.parseUnits("20", 18);
    const amountInMax = ethers.parseUnits("1000", 6);

    const USDC_Contract = await ethers.getContractAt("IERC20", USDC, impersonatedSigner);
    const DAI_Contract = await ethers.getContractAt("IERC20", DAI);
    
    const ROUTER = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS, impersonatedSigner);

    await USDC_Contract.approve(ROUTER, amountOut);

    const usdcBal = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const daiBal = await DAI_Contract.balanceOf(impersonatedSigner.address);
    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

    console.log("usdc balance before swap", Number(usdcBal));
    console.log("dai balance before swap", Number(daiBal));

    await ROUTER.swapTokensForExactTokens(
        amountOut,
        amountInMax,
        [USDC, DAI],
        impersonatedSigner.address,
        deadline
    );

    const usdcBalAfter = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const daiBalAfter = await DAI_Contract.balanceOf(impersonatedSigner.address);

    console.log("=========================================================");

    console.log("usdc balance after swap", Number(usdcBalAfter));
    console.log("dai balance after swap", Number(daiBalAfter));
}
*/
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
