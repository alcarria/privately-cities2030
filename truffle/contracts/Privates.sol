// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.9;

contract Privates {

  event onShareKey(address indexed from, string fromContactKey, address indexed to, string toContactKey);
  event onMessage(address indexed to, address from, string message);

  function shareKey(address to, string memory fromContactKey, string memory toContactKey) public {
    require(to != address(0));

    emit onShareKey(msg.sender, fromContactKey, to, toContactKey);
  }

  function sendMessage(address to, string memory message) public {
    emit onMessage(to, msg.sender, message);
  }
}
