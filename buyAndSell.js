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
const approveForSell = require("./constant/approveForSell");
const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");

const signer = new ethers.Wallet(prv_key, provider);
console.log(signer.address, "Metamask Address");

const routerInstance = new ethers.Contract(routerAddress, routerAbi, signer);