// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.9;

struct GroupKey {
  address groupAddress;
  string groupKey;
}

struct GroupInfo {
  string name;

  // Permissions:
  // 0 - read
  // 1 - write
  // 2 - invite
  // 3 - admin
  mapping(address => uint) permissions;
}

contract Groups {

  mapping(address => string) public publicKeys;

  // K: userAddress
  mapping(address => GroupKey[]) public groupKeys;
  
  // K: groupAddress
  mapping(address => GroupInfo) public groupsInfo;

  event onInvite(address indexed to, address group, string groupKey);

  event onMessage(address from, address group, string message);

  function createGroup(address group, string memory groupName, string memory groupKey) public {
    require(group != address(0));
    require(keccak256(abi.encodePacked(groupsInfo[group].name)) == keccak256(abi.encodePacked(""))); // Group does not exist yet
    require(keccak256(abi.encodePacked(groupName)) != keccak256(abi.encodePacked(""))); // Group has valid name

    GroupKey memory gKey = GroupKey({
      groupAddress: group, 
      groupKey: groupKey
    });

    groupKeys[msg.sender].push(gKey);

    GroupInfo storage gInfo = groupsInfo[group];
    gInfo.name = groupName;
    gInfo.permissions[msg.sender] = 99;
  }

  function invite(address to, address group, string memory groupKey) public { }

  function sendMessage(address group, string memory message) public { }

  function changePermissions(address to, address group, uint permissions) public { }

  function setPublicKey(address my_address, string memory publicKey) public {
    publicKeys[my_address] = publicKey;
  }

  function getPublicKey(address dest_address) public view returns(string memory publicKey) {
    publicKey = publicKeys[dest_address];
  }
}