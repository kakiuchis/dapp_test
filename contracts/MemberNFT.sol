//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract MemberNFT is ERC721Enumerable, ERC721URIStorage, Ownable{
    /// @dev _tokenIdsはCountersの全関数を利用可能
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event TokenURIChanged(address indexed to, uint256 indexed tokenId, string uri);

    constructor() ERC721("MemberNFT", "MEM") {}

    function nftMint(address to, string calldata uri) external onlyOwner {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        /// @dev toアドレスにnewTokenIdをmintする
        _mint(to, newTokenId);
        /// @dev newTokenIdにメタデータuriをセットする
        _setTokenURI(newTokenId, uri);
        emit TokenURIChanged(to, newTokenId, uri);
    }

    /// override解除
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

}