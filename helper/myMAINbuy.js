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

const Buy = async (prv_key, buyPrice) => {
  const signer = new ethers.Wallet(prv_key.private_Key, provider);
  console.log(signer.address, "Metamask  ------------- Address");

  const routerInstance = new ethers.Contract(routerAddress, routerAbi, signer);
  const token1 = new ethers.Contract(fromAddress, erc20ABI, signer); //usdt
  const token2 = new ethers.Contract(toAddress, erc20ABI, signer); //deod

  let getAmountOfUsdt;
  let getAmountOfDeod;
  let getAmountOfUsdtInHumanformat;

  //!FETCH PRICE FOR BUY
  const priceFetchForBuy = async (amount) => {
    // throw new Error("EROR WHILE FETCHING PRICE")
    try {
      const decimal1 = await token1.decimals();
      const decimal2 = await token2.decimals();
      const amountIn = ethers.parseUnits(amount, decimal1).toString();
      amountsOut1 = await routerInstance.getAmountsOut(amountIn, [
        fromAddress,
        toAddress,
      ]);
      getAmountOfUsdt = amountsOut1[0].toString();
      getAmountOfDeod = amountsOut1[1].toString();
      const amountInHumanFormat = ethers.formatUnits(
        amountsOut1[1].toString(),
        decimal2
      );
    } catch (error) {
      throw new Error("ERROR WHILE FETCHING PRICE");
    }
  };

  //TODO:- MAIN BUY FUNCTION
  const buyTokens = async (BuyPrice) => {
    try {
      console.log(colors.bgBrightYellow("INSIDE BUY TOKEN FINAL :)"));

      const getBalanceOfUsdtOfWallet = (
        await token1.balanceOf(signer.address)
      ).toString();
      const getBalanceOfUsdtInHumanFormat = getBalanceOfUsdtOfWallet / 10 ** 6;
      const quoteInHumanFormat = getAmountOfUsdt / 10 ** 6;

      //?Checking USDT BALANCE
      if (getBalanceOfUsdtOfWallet >= quoteInHumanFormat) {
        console.log(true);
        try {
          const buyTokens = await routerInstance.swapExactTokensForTokens(
            getAmountOfUsdt,
            getAmountOfDeod,
            [
              "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
              "0xE77aBB1E75D2913B2076DD16049992FFeACa5235",
            ],
            signer.address,
            3418555736
          );

          const transaction2 = await provider.waitForTransaction(
            buyTokens.hash,
            1,
            150000
          );
          console.log("transaction2", transaction2);
        } catch (error) {
          throw new Error("Error in Buying");
        }
      } else {
        throw new Error("Insufficient Usdt Amount");
        console.log("Insufficient Usdt Amount");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  //TODO: CALLINNG BUY FUNCTION
  const forBuy = async (BuyPrice) => {
    try {
      //!FETCHING PRICE
      await priceFetchForBuy(BuyPrice);

      const getAllowance = (
        await token1.allowance(signer.address, routerAddress)
      ).toString();
      const getAllowanceInHumanFormat = getAllowance / 10 ** 6;
      getAmountOfUsdtInHumanformat = (getAmountOfUsdt / 10 ** 6).toString();

      if (getAllowanceInHumanFormat >= getAmountOfUsdtInHumanformat) {
        try {
          console.log(colors.bgGreen("ALREADY APPROVED  For Buy "));
          await buyTokens();
        } catch (error) {
          console.log();
          throw new Error(error.message);
        }
      } else {
        try {
          console.log(
            colors.bgRed("NOT approved For Buy ------------------------")
          );
          // await approveForBuy(1);
          await buyTokens();
        } catch (error) {
          throw new Error(error.message);
        }
      }
    } catch (error) {
      // console.log(error.message, "error error in ");
      throw new Error(error.message);
    }
  };

  try {
    await forBuy(buyPrice);
  } catch (error) {
    console.error(error.message, "Io Error");
  }
};

// module.exports = Buy;
