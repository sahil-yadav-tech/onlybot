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
const prv_key =
  "682284c05a8771faae393a5e4064e773ce71c432757c4156b8c88241b5717924";
const signer = new ethers.Wallet(prv_key, provider);
console.log(";ancfalskjnglbkm", signer.address);

const routerInstance = new ethers.Contract(routerAddress, routerAbi, signer);

const token1 = new ethers.Contract(fromAddress, usdtAbi, signer); //usdt
const token2 = new ethers.Contract(toAddress, erc20ABI, signer); //deod

// Write function
const approveOnce = async (_amount) => {
  console.log(colors.bgYellow("INSIDE APPROVE ONCE FUNCTION"));
  return true

  const getApproveOfFirstToken = await token1.approve(
    routerAddress,
    (_amount * 10 ** 6).toString()
  );
  console.log(getApproveOfFirstToken, "Inside approvr once ");

  const txn = await provider.waitForTransaction(
    getApproveOfFirstToken.hash,
    1,
    150000
  );
  console.log("txn", txn);

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
};

module.exports = approveOnce;

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
