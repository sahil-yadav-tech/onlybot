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

const MainBuy = async (userDetails, buyPrice) => {
  // console.log(userDetails, buyPrice, "PARAMETERS IN BUY");

  // --------------- IMPORT SECTION IN BUY  START --------------- //
  const signer = new ethers.Wallet(userDetails.private_Key, provider);
  // console.log(signer.address, "Metamask Address");
  const routerInstance = new ethers.Contract(routerAddress, routerAbi, signer);
  const token1 = new ethers.Contract(fromAddress, erc20ABI, signer); //usdt
  const token2 = new ethers.Contract(toAddress, erc20ABI, signer); //deod

  let getAmountOfUsdt;
  let getAmountOfDeod;
  let getAmountOfUsdtInHumanformat;
  // --------------- IMPORT SECTION IN BUY  STOP --------------- //

  //!FETCH PRICE FOR BUY --------------------
  const priceFetchForBuy = async (amount) => {
    throw new Error("EROR WHILE FETCHING PRICE")
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
      // console.log(amountInHumanFormat, "amountInHumanFormat amountInHumanFormat");
    } catch (error) {
      throw new Error("ERROR WHILE FETCHING PRICE");
    }
  };

  //TODO:- MAIN BUY FUNCTION ---------------
  const buyTokens = async (BuyPrice) => {
    try {
      console.log(colors.bgBrightYellow("INSIDE BUY TOKEN FINAL :)"));
      // throw new Error("Error In BuYTOKENS ")

      const balanceInWei = await provider.getBalance(signer.address);
      // console.log("balanceInWeiForBuy", balanceInWei);
      const matic = await ethers.formatEther(balanceInWei);

      const getBalanceOfUsdtOfWallet = (
        await token1.balanceOf(signer.address)
      ).toString();
      const getBalanceOfUsdtInHumanFormat = getBalanceOfUsdtOfWallet / 10 ** 6;
      const quoteInHumanFormat = getAmountOfUsdt / 10 ** 6;

      //?Checking USDT BALANCE
      if (matic >= 0.4) {
        if (getBalanceOfUsdtInHumanFormat >= quoteInHumanFormat) {
          console.log(true, "EveryThing Working Fine Buy Functio insid buy main funcnction");
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
            console.log(transaction2.hash, "congratulations Buy transaction done");
          } catch (error) {
            console.log(error, "error between 90 to 100");
            throw new Error("Error in Buying");
          }
        } else {
          console.log("Insufficient Usdt Amount");
          throw new Error("Insufficient Usdt Amount");
        }
      } else {
        // console.log("Insufficient Matic for buying");
        throw new Error("Insufficient Matic for buying");
      }
    } catch (error) {
      // console.log(error, "error");
      throw new Error(error.message);
    }
  };

  //TODO: CALLINNG BUY FUNCTION -------------
  const forBuy = async (amount) => {
    try {
      //!FETCHING PRICE
      const amountToString = amount.toString();
      await priceFetchForBuy(amountToString);

      const getAllowance = (
        await token1.allowance(signer.address, routerAddress)
      ).toString();
      // console.log("getAllowance", getAllowance);

      const getAllowanceInHumanFormat = getAllowance / 10 ** 6;
      // console.log("getAllowanceInHumanFormat", getAllowanceInHumanFormat);

      getAmountOfUsdtInHumanformat = getAmountOfUsdt / 10 ** 6;
      // console.log("getAmountOfUsdtInHumanformat", getAmountOfUsdtInHumanformat);

      if (getAllowanceInHumanFormat >= getAmountOfUsdtInHumanformat) {
        try {
          console.log(colors.bgGreen("ALREADY APPROVED  For Buy "));
          await buyTokens();
        } catch (error) {
          // console.log(error, "Error Where Buy is Already Approved");
          throw new Error(error.message);
        }
      } else {
        try {
          console.log(
            colors.bgRed("NOT approved For Buy ------------------------")
          );
          await approveForBuy(4, userDetails.private_Key);
          await buyTokens();
        } catch (error) {
          // console.log(error, "Errro Where buy Not approved");
          throw new Error(error.message);
        }
      }
    } catch (error) {
      // console.log(error,"Errror in For function tryCatch function");
      throw new Error(error.message);
    }
  };

  try {
    await forBuy(buyPrice);
  } catch (error) {
    // console.log(error, "Error in ForBuy TryCatch ");
    throw new Error(`${error.message} By User Id ${userDetails.id} action Buy`);
    // userDetails
  }
};

module.exports = MainBuy;

// const mainLoop = async () => {
//   while (true) {
//     await Buy(0, 0.5);
//     await new Promise((resolve) => setTimeout(resolve, 15000));
//   }
// };

// mainLoop().catch(console.error);

// console.log(amount, "Amoukddj");
//       console.log("Hei uske Upper hu");
//     return true;
