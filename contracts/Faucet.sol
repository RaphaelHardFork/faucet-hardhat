//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./FarahToken.sol";

/**
 * @notice TODO: different options faucet
 * */
contract Faucet {
    FarahToken private _token;
    mapping(address => uint256) private _getTime;
    address private _tokenOwner;
    uint256 private _amountReceived;

    constructor(
        address farahTokenAddress,
        address tokenOwner_,
        uint256 amountReceived_
    ) {
        _token = FarahToken(farahTokenAddress);
        _tokenOwner = tokenOwner_;
        _amountReceived = amountReceived_;
    }

    function getToken() public {
        require(block.timestamp >= _getTime[msg.sender], "Faucet: is available each three days");
        _getTime[msg.sender] = block.timestamp + 3 days;
        _token.transferFrom(_tokenOwner, msg.sender, _amountReceived);
    }

    function tokenOwner() public view returns (address) {
        return _tokenOwner;
    }

    function tokenContractAddress() public view returns (address) {
        return address(_token);
    }

    function amountReceived() public view returns (uint256) {
        return _amountReceived;
    }

    function remainingSupply() public view returns (uint256) {
        return _token.allowance(tokenOwner(), address(this));
    }

    function timeRemainingOf(address account) public view returns (uint256) {
        if (_getTime[account] == 0 || _getTime[account] < block.timestamp) {
            return 0;
        } else {
            return _getTime[account] - block.timestamp;
        }
    }
}
