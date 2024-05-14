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
const approveForSell = async (_amount) => {
  try {
    const prv_key =
      "32e6767e9f60c6ffa36bb825c25ebe75b8ecd9d0a29eb6bf3221c112d68733a0";
    const signer = new ethers.Wallet(prv_key, provider);
    console.log(";ancfalskjnglbkm", signer.address);

    const routerInstance = new ethers.Contract(
      routerAddress,
      routerAbi,
      signer
    );

    const token1 = new ethers.Contract(fromAddress, usdtAbi, signer); //usdt
    const token2 = new ethers.Contract(toAddress, erc20ABI, signer); //deod

    console.log(colors.bgCyan("INSIDE SEll APPROVE "));
    // throw new Error("Error in Approval");
    const getApproveOfSecondToken = await token2.approve(
      routerAddress,
      (_amount * 10 ** 18).toString()
    );
    const txn1 = await provider.waitForTransaction(
      getApproveOfSecondToken.hash,
      1,
      150000
    );
    console.log("txn", txn1);
  } catch (error) {
    // console.log(error.message, "error In APPROVAL");
    throw new Error("error In APPROVAL, Please matic!");
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
