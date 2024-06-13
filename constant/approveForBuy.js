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
const approveForBuy = async (_amount, private_key) => {
  const signer = new ethers.Wallet(private_key, provider);
  console.log( signer.address, "Metamask address for Buy Approval");
  const routerInstance = new ethers.Contract(routerAddress, routerAbi, signer);
  const token1 = new ethers.Contract(fromAddress, usdtAbi, signer); //usdt
  const token2 = new ethers.Contract(toAddress, erc20ABI, signer); //deod

  console.log(colors.bgBrightBlue("INSIDE BUY APPROVE FUNCTION"));
  // throw new Error("Error in buy Approval")
  try {
    const balanceInWei = await provider.getBalance(signer.address);
    // console.log("balanceInWei For buying Approval", balanceInWei);

    const matic = await ethers.formatEther(balanceInWei);
    console.log( matic, "User matic For Buy Approval" );
    if (matic >= 0.1) {
      const getApproveOfFirstToken = await token1.approve(
        routerAddress,
        (_amount * 10 ** 6).toString()
      );
      // console.log(getApproveOfFirstToken, "Inside approvr once ");

      const txn = await provider.waitForTransaction(
        getApproveOfFirstToken.hash,
        1,
        150000
      );
      console.log(txn.hash, "Buy Approval Done");
    }else{
      // console.log("Not Enough Matic for Buying approval");
      throw new Error("Not Enough Matic for Buying approval");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = approveForBuy;

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
