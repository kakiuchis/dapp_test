const {expect} = require("Chai");
const {ethers} = require("hardhat");

describe("MemberNFT Contract", function() {
    let MemberNFT;
    let memberNFT;
    const name = "MemberNFT";
    const symbol = "MEM";
    let owner;

    beforeEach(async function() {
        [owner] = await ethers.getSigners();
        MemberNFT = await ethers.getContractFactory("MemberNFT");
        memberNFT = await MemberNFT.deploy();
        await memberNFT.deployed();
    });

    it("TokenとSymbolがセットされる", async function() {
        expect(await memberNFT.name()).to.equal(name);
        expect(await memberNFT.symbol()).to.equal(symbol);
    });
    it("Owner addressがdeployer addressと一致", async function() {
        expect(await memberNFT.owner()).to.equal(owner.address);
    });
})