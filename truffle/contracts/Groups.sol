// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.9;

  struct GroupKey {
    address groupAddress;
    string groupKey;
  }

  struct GroupInfo {
    string name;

    // Permissions:
    // 0 - forbidden
    // 1 - read
    // 2 - write
    // 3 - invite
    // 4 - admin
    mapping(address => uint) permissions;
  }

contract Groups {

  mapping(address => string) public publicKeys;

  // K: userAddress
  mapping(address => GroupKey[]) public groupKeys;

  // K: groupAddress
  mapping(address => GroupInfo) public groupsInfo;

  event onInvite(address indexed to, address group, string groupKey);
  event onMessage(address indexed group, address from, string message);

  function createGroup(address group, string memory groupName, string memory groupKey) public {
    require(group != address(0));
    bytes memory existingGroupName = bytes(groupsInfo[group].name);
    require(existingGroupName.length == 0);
    // Group does not exist yet
    bytes memory bGroupname = bytes(groupName);
    require(bGroupname.length > 0);
    // Group has valid name

    GroupKey memory gKey = GroupKey({
    groupAddress : group,
    groupKey : groupKey
    });

    groupKeys[msg.sender].push(gKey);

    GroupInfo storage gInfo = groupsInfo[group];
    gInfo.name = groupName;
    gInfo.permissions[msg.sender] = 99;

    emit onInvite(msg.sender, group, groupKey);
  }

  function invite(address to, address group, string memory groupKey) public {
    require(groupsInfo[group].permissions[msg.sender] >= 3);
    //The sender has permissions
    require(groupsInfo[group].permissions[to] == 0);
    //He is not in the group

    GroupKey memory gKey = GroupKey({
    groupAddress : group,
    groupKey : groupKey
    });

    groupKeys[to].push(gKey);

    GroupInfo storage gInfo = groupsInfo[group];
    gInfo.permissions[to] = 1;

    emit onInvite(to, group, groupKey);
  }

  function sendMessage(address group, string memory message) public {
    require(groupsInfo[group].permissions[msg.sender] >= 2);
    //The sender has permissions

    emit onMessage(group, msg.sender, message);
  }

  function changePermissions(address to, address group, uint permissions) public {
    require(groupsInfo[group].permissions[msg.sender] >= 4);
    require(groupsInfo[group].permissions[to] > 0);
    require(groupsInfo[group].permissions[msg.sender] > permissions);
    require(groupsInfo[group].permissions[to] < groupsInfo[group].permissions[msg.sender]);

    groupsInfo[group].permissions[to] = permissions;
  }

  function setPublicKey(address my_address, string memory publicKey) public {
    publicKeys[my_address] = publicKey;
  }

  function getPublicKey(address dest_address) public view returns (string memory publicKey) {
    publicKey = publicKeys[dest_address];
  }
}
