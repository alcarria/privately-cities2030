// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.9;

  struct Contact {
    address contactAddress;
    string contactKey;
  }

contract Privates {

  mapping(address => string) public publicKeys;

  mapping(address => Contact[]) public contactInfo;

  event onShareKey(address indexed from, string fromContactKey, address indexed to, string toContactKey);
  event onMessage(address indexed to, address from, string message);

  function shareKey(address to, string memory fromContactKey, string memory toContactKey) public {
    require(to != address(0));

    Contact memory fromCKey = Contact({
    contactAddress : to,
    contactKey : fromContactKey
    });

    Contact memory cKey = Contact({
    contactAddress : msg.sender,
    contactKey : toContactKey
    });

    contactInfo[msg.sender].push(fromCKey);
    contactInfo[to].push(cKey);

    emit onShareKey(msg.sender, fromContactKey, to, toContactKey);
  }

  function sendMessage(address to, string memory message) public {
    emit onMessage(to, msg.sender, message);
  }

  function setPublicKey(address my_address, string memory publicKey) public {
    publicKeys[my_address] = publicKey;
  }

  function getPublicKey(address dest_address) public view returns (string memory publicKey) {
    publicKey = publicKeys[dest_address];
  }
}
