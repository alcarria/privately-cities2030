// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.9;

struct ContactInfo {
  string nickname;
  string publicKey;
}

contract Contact {

  mapping(address => ContactInfo) contactsInfo;

  function setContactInfo(string memory nickname, string memory publicKey) public {
    // Check nickname not empty
    bytes memory nicknameBytes = bytes(nickname);
    require(nicknameBytes.length > 0);

    // Check publicKey not empty
    bytes memory publicKeyBytes = bytes(publicKey);
    require(publicKeyBytes.length > 0);

    ContactInfo memory contact = ContactInfo({
      nickname : nickname,
      publicKey : publicKey
    });

    contactsInfo[msg.sender] = contact;
  }

  function getContact(address contactAddress) public view returns (string memory nickname, string memory publicKey) {
    require(contactAddress != address(0));
    return (contactsInfo[contactAddress].nickname, contactsInfo[contactAddress].publicKey);
  }
}
