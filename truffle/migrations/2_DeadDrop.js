const DeadDrop = artifacts.require("DeadDrop");

module.exports = function (deployer) {
  deployer.deploy(DeadDrop);
};
