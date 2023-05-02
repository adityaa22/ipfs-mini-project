require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia:{
      url: 'https://eth-sepolia.g.alchemy.com/v2/ebCkXgmWh__EomS41DKPXqodvYL0zwLV',
      accounts: ['aa18ef0a175e1830aeb712f6ab5eeaefe6c43d2223455da2879ac8a9d198a959']
    }
  }
};
