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
    let addr3;
    const zeroAddress = "0x0000000000000000000000000000000000000000";

    beforeEach(async function() {
        [owner, addr1, addr2, addr3] = await ethers.getSigners();
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
        it("銀行残高トータルは0", async function() {
            expect(await tokenBank.bankTotalDeposit()).to.equal(0);
        });
    });
    describe("アドレス間のToken移転", function(){
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
    describe("アドレス→BankのToken移転", function(){
        beforeEach(async function(){
            await tokenBank.transfar(addr1.address, 500);
            await tokenBank.transfar(addr2.address, 200);
            await tokenBank.transfar(addr3.address, 100);
            await tokenBank.connect(addr1).deposit(100);
            await tokenBank.connect(addr2).deposit(200);
        });
        it("Token預入が成功する", async function() {
            const addr1Balance = await tokenBank.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(400);
            const addr1bankBalance = await tokenBank.bankBalanceOf(addr1.address);
            expect(addr1bankBalance).to.equal(100);
        });
        it("Token預入後のアドレス間移転が成功する", async function() {
            const startAddr1Balance = await tokenBank.balanceOf(addr1.address);
            const startAddr2Balance = await tokenBank.balanceOf(addr2.address);
            await tokenBank.connect(addr1).transfar(addr2.address, 100);
            const endAddr1Balance = await tokenBank.balanceOf(addr1.address);
            const endAddr2Balance = await tokenBank.balanceOf(addr2.address);
            expect(endAddr1Balance).to.equal(startAddr1Balance.sub(100));
            expect(endAddr2Balance).to.equal(startAddr2Balance.add(100));
        });
        it("Token預入後、eventが発行される", async function() {
            await expect(tokenBank.connect(addr1).deposit(100)).to.emit(tokenBank, "TokenDeposit").withArgs(addr1.address, 100);
        });
    });

})