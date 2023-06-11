const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenBank Contract", function() {
    let TokenBank;
    let tokenBank;
    const name = "Token";
    const symbol = "TBK";
    let owner;
    let addr1;
    let addr2;
    const zeroAddress = "0x0000000000000000000000000000000000000000";

    beforeEach(async function() {
        [owner, addr1, addr2] = await ethers.getSigners();
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
    describe("Token移転", function(){
        beforeEach(async function(){
            await tokenBank.transfar(addr1.address, 500);
        });
        it("Token移転が成功する", async function() {
            const startAddr1Balance = await tokenBank.balanceOf(addr1.address);
            const startAddr2Balance = await tokenBank.balanceOf(addr2.address);
            await tokenBank.connect(addr1).transfar(addr2.address, 100);
            const endAddr1Balance = await tokenBank.balanceOf(addr1.address);
            const endAddr2Balance = await tokenBank.balanceOf(addr2.address);
            expect(endAddr1Balance).to.equal(startAddr1Balance.sub(100));
            expect(endAddr2Balance).to.equal(startAddr2Balance.add(100));
        });
        it("ゼロアドレス宛の移転は失敗する", async function() {
            await expect(tokenBank.transfar(zeroAddress, 100)).to.be.revertedWith("Zero address cannot transfar.");
        });
        it("残高不足の移転は失敗する", async function() {
            await expect(tokenBank.connect(addr1).transfar(addr2.address, 510)).to.be.revertedWith("Your money is running low.");
        });
        it("Token移転後、eventが発行される", async function() {
            await expect(tokenBank.connect(addr1).transfar(addr2.address, 100)).to.emit(tokenBank, "TokenTransfar").withArgs(addr1.address, addr2.address, 100);
        });
    });

})