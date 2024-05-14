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

const approveForSell = require("./constant/approveForSell");
const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");

//!PRIVATE KEY
const prv_key =
  "32e6767e9f60c6ffa36bb825c25ebe75b8ecd9d0a29eb6bf3221c112d68733a0";
//!METAMASK ADDRESS
const signer = new ethers.Wallet(prv_key, provider);
console.log(signer.address, "Metamask Address");

const factoryInstance = new ethers.Contract(
  factoryAddress,
  factoryAbi,
  provider
);

// console.log(factoryInstance);
const routerInstance = new ethers.Contract(routerAddress, routerAbi, signer);
const token1 = new ethers.Contract(fromAddress, usdtAbi, signer); //usdt
const token2 = new ethers.Contract(toAddress, erc20ABI, signer); //deod

let getAmountOfUsdt;
let getAmountOfDeod;

//!FETCH PRICE FOR SELL
const priceFetchForSell = async (amount) => {
  const decimal1 = await token1.decimals();
  const decimal2 = await token2.decimals();
  //   console.log("decimal2", Number(decimal2));

  const amountIn = ethers.parseUnits(amount, decimal2).toString();
  //   console.log(amountIn, "amountIn");

  amountsOut1 = await routerInstance.getAmountsOut(amountIn, [
    toAddress,
    fromAddress,
  ]);

  console.log("amountsOut1", amountsOut1);
  getAmountOfDeod = amountsOut1[0].toString();
  // console.log("getAmountOfDeod", getAmountOfDeod);

  getAmountOfUsdt = amountsOut1[1].toString();
  // console.log("getAmountOfUsdt", getAmountOfUsdt);

  const amountInHumanFormat = ethers.formatUnits(
    amountsOut1[1].toString(),
    decimal2
  );
  //   console.log("amountInHumanFormat", amountInHumanFormat);
};

//TODO:- MAIN SEll FUNCTION
const sellTokens = async () => {
  const getBalanceOfDeod = await token2.balanceOf(signer.address);
  console.log("getBalanceOfDeod", getBalanceOfDeod);

  const getBalanceOfDeodInhumanFormat = getAmountOfDeod / 10 ** 18;
  console.log("getBalanceOfDeodInhumanFormat", getBalanceOfDeodInhumanFormat);

  if (getBalanceOfDeod >= getAmountOfDeod) {
    console.log(true);
    const sellTokens = await routerInstance.swapExactTokensForTokens(
      getAmountOfDeod,
      getAmountOfUsdt,
      [
        "0xE77aBB1E75D2913B2076DD16049992FFeACa5235",
        "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      ],
      signer.address,
      3418555736
      // {
      //   nonce: (await provider.getTransactionCount(signer.address)) + 1,
      // }
    );

    // const transaction2 = await sellTokens.wait();

    const transaction2 = await provider.waitForTransaction(
      sellTokens.hash,
      1,
      150000
    );
    console.log("transaction2", transaction2);
  } else {
    console.log("Insufficient Deod Amount");
  }
};

//TODO: CALLINNG SELL FUNCTION
const forSell = async (userId) => {
  //approve of usdt tloken to router address
  await priceFetchForSell("50");
  const getAllowance = (
    await token2.allowance(signer.address, routerAddress)
  ).toString();

  const a = await signer.getNonce();

  if (getAllowance >= getAmountOfDeod) {
    try {
      console.log(colors.bgGreen("ALREADY APPROVED  For SELL "));
      await sellTokens();
    } catch (error) {
      console.log(error);
    }
  } else {
    // console.log("Give more allowance");
    try {
      console.log(
        colors.bgRed("NOT approved For Sell ------------------------")
      );
      await approveForSell(100);
      await sellTokens();
    } catch (error) {
      console.log(error);
    }
  }
};
module.exports = forSell;
// (async () => {
//   await forSell();
// })();

// const mainLoop = async () => {
//   while (true) {
//     await forSell();
//     await new Promise((resolve) => setTimeout(resolve, 1500));
//   }
// };

// mainLoop().catch(console.error);

// (async () => {
//   await priceFetchForSell("50");
//   await forSell();
// })();
