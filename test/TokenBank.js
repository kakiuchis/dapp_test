const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenBank Contract", function() {
    let TokenBank;
    let tokenBank;
    const name = "Token";
    const symbol = "TBK";
    let owner;

    beforeEach(async function() {
        [owner] = await ethers.getSigners();
        TokenBank = await ethers.getContractFactory("TokenBank");
        tokenBank = await TokenBank.deploy(name, symbol);
        await tokenBank.deployed();
    });

    describe("デプロイ", function(){
        it("TokenとSymbolがセットされる", async function() {
            expect(await tokenBank.name()).to.equal(name);
            expect(await tokenBank.symbol()).to.equal(symbol);
        });
        it("Owner addressがdeployer addressと一致", async function() {
            expect(await tokenBank.owner()).to.equal(owner.address);
        });
        it("Ownerに総額が割り当てられる", async function() {
            const ownerBalance = await tokenBank.balanceOf(owner.address);
            expect(await tokenBank.totalSupply()).to.equal(ownerBalance);
        });
    });

})