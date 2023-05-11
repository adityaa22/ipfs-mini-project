import Web3 from 'web3';
import Provider from '@truffle/hdwallet-provider';
import CarSales from '../build/contracts/CarSales.json' assert { type: "json" };


const Contract = async(privateKey) => {
    const provider = new Provider(privateKey || process.env.DEFAULT_KEY, process.env.NODE_ENDPOINT);
    const web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();
    const contract = new web3.eth.Contract(
        CarSales.abi,
        CarSales.networks[networkId].address
    );
    return contract
}

export default Contract