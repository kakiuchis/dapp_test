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

    // Tokenのユーザー→ユーザー移転ログ
    event TokenTransfar(
        address indexed from,
        address indexed to,
        uint256 amount
    );

    // Tokenのユーザー→Bank移転ログ
    event TokenDeposit(
        address indexed from,
        uint256 amount
    );

    // TokenのBank→ユーザー移転ログ
    event TokenWithdraw(
        address indexed from,
        uint256 amount
    );

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        owner = msg.sender;
        _balances[owner] = _totalSupply;
    }

}