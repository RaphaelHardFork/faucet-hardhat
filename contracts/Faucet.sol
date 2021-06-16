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
        require(_timeRemaining(block.timestamp, _getTime[msg.sender]) <= 0, "Faucet: is available each three days");
        _getTime[msg.sender] = block.timestamp;
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

    function timeRemainingOf(address account) public view returns (int256) {
        if (_timeRemaining(block.timestamp, _getTime[account]) <= 0) {
            return 0;
        } else {
            return _timeRemaining(block.timestamp, _getTime[account]);
        }
    }

    function _timeRemaining(uint256 timestamp, uint256 getTime) private pure returns (int256) {
        return int256(3 days - (timestamp - getTime));
    }
}
