const ethers = require("ethers");
const colors = require("colors");
const {
  factoryAddress,
  routerAddress,
  fromAddress,
  toAddress,
} = require("./constant/address");
const {
  erc20ABI,
  factoryAbi,
  pairABI,
  routerAbi,
  usdtAbi,
} = require("./constant/abi");
const approveForBuy = require("./constant/approveForBuy");
const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");

const routerInstance = new ethers.Contract(routerAddress, routerAbi, provider);
const token1 = new ethers.Contract(fromAddress, erc20ABI, provider); //usdt
const token2 = new ethers.Contract(toAddress, erc20ABI, provider);

let getAmountOfUsdt;
let getAmountOfDeod;
let getAmountOfUsdtInHumanformat;

const priceFetchForBuy = async (amount) => {
  console.log(amount, "amount amount");
  // proce
  // throw new Error("EROR WHILE FETCHING PRICE")
  try {
    const decimal1 = await token1.decimals();
    const decimal2 = await token2.decimals();
    const amountIn = ethers.parseUnits(amount.toString(), decimal1).toString();
    amountsOut1 = await routerInstance.getAmountsOut(amountIn, [
      fromAddress,
      toAddress,
    ]);
    getAmountOfUsdt = amountsOut1[0].toString();
    getAmountOfDeod = amountsOut1[1].toString();
    getAmountOfUsdtInHumanformat = await ethers.formatUnits(
      amountsOut1[1].toString(),
      decimal2
    );
   
    console.log(getAmountOfUsdtInHumanformat, typeof getAmountOfUsdtInHumanformat);
    const deodPriceInNumber = parseFloat(getAmountOfUsdtInHumanformat).toFixed(2)
    console.log(deodPriceInNumber, typeof deodPriceInNumber, "deodPriceInNumber", deodPriceInNumber.toString());
    // process.exit()
    return deodPriceInNumber.toString();
  } catch (error) {
    console.log(error, "error jhjdhdhdhdhdhh");
    throw new Error("ERROR WHILE FETCHING PRICE");
  }
};

// priceFetchForBuy("1");
module.exports = priceFetchForBuy;
