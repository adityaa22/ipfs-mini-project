const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const CarSales = require('./build/contracts/CarSales.json');
const address = '0xf680a56e1e408E78C236e2eD8A639fAD87BDC27c'
const privateKey = "aa18ef0a175e1830aeb712f6ab5eeaefe6c43d2223455da2879ac8a9d198a959"
const provider = new Provider(privateKey, 'https://sepolia.infura.io/v3/a5ad7a45de4c46acace6d69728f2a494');
let obj
const Transaction = async () => {
    const web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();
    const contract = new web3.eth.Contract(
        CarSales.abi,
        CarSales.networks[networkId].address
    );

    // const receipt = await contract.methods.addCar("audi", 1).send({ from: address })
    // console.log(`Transaction hash: ${receipt.transactionHash}`);
    // obj = await contract.methods.cars(0).call();
}

// Transaction()

