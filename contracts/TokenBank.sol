//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract TokenBank {
    string private _name;
    string private _symbol;
    uint256 constant _totalSupply = 1000;
    uint256 private _bankTotalDeposit;
    address public owner;

    // アドレスのToken残高
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

    // nameを返すfunction
    function name() public view returns (string memory) {
        return _name;
    }

    // symbolを返すfunction
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    // totalSupplyを返すfunction
    function totalSupply() public pure returns (uint256) {
        return _totalSupply;
    }

    // アドレスの残高を返すfunction
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    // Token移転function
    function transfar(address to, uint256 amount) public {
        address from = msg.sender;
        _transfar(from, to, amount);
    }

    // Token移転の内部関数
    function _transfar(address from, address to, uint256 amount) internal {
        require(to != address(0), "Zero address cannot transfar.");
        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "Your money is running low.");
        _balances[from] = fromBalance - amount;
        _balances[to] += amount;
        emit TokenTransfar(from, to, amount);
    }
}