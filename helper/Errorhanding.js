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
  console.log(signer.address, "Metamask Address -------------");

  const routerInstance = new ethers.Contract(routerAddress, routerAbi, signer);
  const token1 = new ethers.Contract(fromAddress, erc20ABI, signer); //usdt
  const token2 = new ethers.Contract(toAddress, erc20ABI, signer); //deod

  let getAmountOfUsdt;
  let getAmountOfDeod;
  let getAmountOfUsdtInHumanformat;
  console.log(getAmountOfUsdt, "getAmountOfUsdt");

  //!FETCH PRICE FOR BUY
  const priceFetchForBuy = async (amount) => {
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
    // throw new Error("EROR WHILE FETCHING PRICE");
  };

  //TODO:- MAIN BUY FUNCTION
  const buyTokens = async () => {

    
    console.log("INSIDE BUY TOKEN S");
   
    
    try {
        throw new Error("error in buyTokens");
        
      console.log(colors.bgBrightYellow("INSIDE BUY TOKEN"));
      // check balance of usdt in wallet
      const getBalanceOfUsdtOfWallet = (
        await token1.balanceOf(signer.address)
      ).toString();
      console.log("getBalanceOfUsdtOfWallet", getBalanceOfUsdtOfWallet);

      const getBalanceOfUsdtInHumanFormat = getBalanceOfUsdtOfWallet / 10 ** 6;
      console.log(
        "getBalanceOfUsdtInHumanFormat",
        getBalanceOfUsdtInHumanFormat
      );

      const quoteInHumanFormat = getAmountOfUsdt / 10 ** 6;

      //?Checking USDT BALANCE
      if (getBalanceOfUsdtOfWallet >= quoteInHumanFormat) {
        console.log(true);
        // process.exit();
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
      } else {
        throw new Error("Insufficient Usdt Amount");
        console.log("Insufficient Usdt Amount");
      }
    } catch (error) {
    //   console.log(error.message, "error");
    throw new Error(error.message)
    }
  };

  //TODO: CALLINNG BUY FUNCTION
  const forBuy = async (BuyPrice) => {
    try {
      console.log(BuyPrice, "BuyPrice");

      const price = await priceFetchForBuy("0.5");
      console.log(price, "price");

      // check here only allowance
      //allowance of usdt token to router address
      const getAllowance = (
        await token1.allowance(signer.address, routerAddress)
      ).toString();

      const getAllowanceInHumanFormat = getAllowance / 10 ** 6;
      console.log(getAllowanceInHumanFormat, ", getAllowanceInHumanFormat");
      const a = await signer.getNonce();

      getAmountOfUsdtInHumanformat = (getAmountOfUsdt / 10 ** 6).toString();

      //   call function of router contract i.e swapExactTokensForTokens

      if (getAllowanceInHumanFormat >= getAmountOfUsdtInHumanformat) {
        try {
          console.log(colors.bgGreen("ALREADY APPROVED  For Buy "));
          //   process.exit();
          await buyTokens();
        } catch (error) {
          console.log("sahil");
        }
      } else {
        try {
          console.log(
            colors.bgRed("NOT approved For Buy ------------------------")
          );
        //   await approveForBuy(1);
          await buyTokens();
        } catch (error) {
        //   console.log(error.message, "hey");
        throw new Error(error.message)
        }
      }
    } catch (error) {
      console.log(error.message, "error error in ");
    }
  };

  try {
    console.log("indide buy");
    await forBuy(buyPrice);
  } catch (error) {
    console.error("Error occurred while executing main function:", error);
  }
};

module.exports = Buy;
