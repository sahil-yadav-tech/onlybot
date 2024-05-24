const balanceInWei = await provider.getBalance(signer.address);
console.log("balanceInWei For buying Approval", balanceInWei);

const matic = await ethers.formatEther(balanceInWei);
console.log("matic for buying approval", matic);