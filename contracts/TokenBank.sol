//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract TokenBank {
    string private _name;
    string private _symbol;
    uint256 constant _totalSupply = 1000;
    uint256 private _bankTotalDeposit;
    address public owner;

    //アドレスのToken残高
    mapping(address => uint256) private _balances;
    // TokenBankの残高
    mapping(address => uint256) private _tokenBankBalances;

}