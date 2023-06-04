const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MemberNFT Contract", function() {
    let MemberNFT;
    let memberNFT;
    const name = "MemberNFT";
    const symbol = "MEM";
    const tokenURI1 = "xxxxxxxxx_1";
    const tokenURI2 = "xxxxxxxxx_2";
    let owner;
    let addr1;

    beforeEach(async function() {
        [owner, addr1] = await ethers.getSigners();
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
    it("ownerはmintできる", async function() {
        await memberNFT.nftMint(addr1.address, tokenURI1);
        expect(await memberNFT.ownerOf(1)).to.equal(addr1.address);
    });
    it("mint毎にtokenIdが+1される", async function() {
        await memberNFT.nftMint(addr1.address, tokenURI1);
        await memberNFT.nftMint(addr1.address, tokenURI2);
        expect(await memberNFT.tokenURI(1)).to.equal(tokenURI1);
        expect(await memberNFT.tokenURI(2)).to.equal(tokenURI2);
    });
    it("owner以外はmintできない", async function() {
        await expect(memberNFT.connect(addr1).nftMint(addr1.address, tokenURI1)).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("nint後にTokenURIChangedイベントが発行される", async function() {
        await expect(memberNFT.nftMint(addr1.address, tokenURI1)).to.emit(memberNFT, "TokenURIChanged").withArgs(addr1.address, 1, tokenURI1);
    })
})