const fs = require("fs");
const memberNFTAddress = require("../memberNFTContract");

const main = async () => {
    const addr1 = "0x6765750129d6c2Ca7E76fc56966EA8c5C7013edd";
    const addr2 = "0xfDC30EAb40515D5bB9F9CD99c914Bb04AdaD7693";
    const addr3 = "0xC82b9bb5fA73A7Ed3F0792b6F7E85fAeF80dc8C5";
    const addr4 = "0xC16f94Ba9BB3B9155235ce4C8D1Cb21B4cA17131";

    // deploy
    const TokenBank = await ethers.getContractFactory("TokenBank");
    const tokenBank = await TokenBank.deploy("TokenBank", "TBK", memberNFTAddress);
    await tokenBank.deployed();

    console.log(`Contract deployed to: https://mumbai.polygonscan.com/address/${tokenBank.address}`);

    // トークン移転
    let tx = await tokenBank.transfar(addr2, 300);
    await tx.wait();
    console.log("transferred to addr2");
    tx = await tokenBank.transfar(addr3, 200);
    await tx.wait();
    console.log("transferred to addr3");
    tx = await tokenBank.transfar(addr4, 100);
    await tx.wait();
    console.log("transferred to addr4");

    // Veryfyで読み込むargument.jsを生成
    fs.writeFileSync("./argument.js",
    `
    module.exports = [
        "TokenBank", 
        "TBK",
        "${memberNFTAddress}"
    ]
    `
    );

    // フロントエンドが読み込むcontracts.jsを生成
    fs.writeFileSync("./contracts.js",
    `
    export const memberNFTAddress = "${memberNFTAddress}"
    export const tokenBankAddress = "${tokenBank.address}"
    `
    );
}


const tokenBankDeploy = async () => {
    try{
        await main();
        process.exit(0);
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
};

tokenBankDeploy();