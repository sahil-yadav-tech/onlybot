const ethers = require("ethers");
const colors = require("colors");
const {
  factoryAddress,
  routerAddress,
  fromAddress,
  toAddress,
} = require("./address");

const { erc20ABI, factoryAbi, pairABI, routerAbi, usdtAbi } = require("./abi");

const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");

// Write function
const approveForSell = async (userDetails, _amount) => {
  // console.log(userDetails, _amount, "userDetails,_amount");
  try {
    const prv_key = userDetails.private_Key;
    const signer = new ethers.Wallet(prv_key, provider);
    console.log(signer.address, "Metamask address for Sell Approval");
    //  throw new Error("Eoor in Appproval IN SELL");
    const routerInstance = new ethers.Contract(
      routerAddress,
      routerAbi,
      signer
    );

    const token1 = new ethers.Contract(fromAddress, usdtAbi, signer); //usdt
    const token2 = new ethers.Contract(toAddress, erc20ABI, signer); //deod

    console.log(colors.bgCyan("INSIDE SEll APPROVE "));
    // throw new Error("Error in Approval");

    const balanceInWei = await provider.getBalance(signer.address);
    // console.log("balanceInWei For buying Approval", balanceInWei);

    const matic = await ethers.formatEther(balanceInWei);
    // console.log("matic for buying approval", matic);
    // console.log(_amount * 10 ** 18, );
    // console.log(BigInt(_amount * 10 ** 18,));
    // console.log(200*10**18);
    //     process.exit()
    console.log( matic,"User matic For Sell Approval" );
    if (matic >= 0.1) {
      // Convert _amount to its equivalent in Wei using parseUnits
      const tokenDecimals = await token2.decimals();
      const amountInWei = ethers.parseUnits(_amount.toString(), tokenDecimals);
      //  console.log(tokenDecimals, amountInWei, "what -------------");
      const getApproveOfSecondToken = await token2.approve(
        routerAddress,
        amountInWei
      );
      const txn1 = await provider.waitForTransaction(
        getApproveOfSecondToken.hash,
        1,
        150000
      );
      console.log(txn1.hash, "Sell approval done");
    } else {
      // console.log("Not Enough Matic for Selling approval");
      throw new Error("Not Enough Matic for Selling approval");
    }
  } catch (error) {
    // console.log(error, "error In APPROVAL");
    throw new Error(
      `error In APPROVAL, Please matic! BY USERID ${userDetails.id} `
    );
  }
};

module.exports = approveForSell;

//Read function
// const getAllownace = async (_address, _spender) => {
//   const getAllownaceOfFirstToken = (
//     await token1.allowance(_address, _spender)
//   ).toString();
//   console.log("getAllownaceOfFirstToken", getAllownaceOfFirstToken);

//   const getAllownceOfSecondToken = (
//     await token2.allowance(_address, _spender)
//   ).toString();
//   console.log("getAllownceOfSecondToken", getAllownceOfSecondToken);
// };

// getAllownace(
//   "0x3e2E7E6c8802821147c00742b2aA64167BE757b0",
//   "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"
// );
