import Web3 from 'web3';
import CarSales from '../build/contracts/CarSales.json';

const GenerateCarReceipt = async (privateKey, carInfo, address) => {
    const web3 = new Web3(process.env.REACT_APP_NODE_ENDPOINT);
    const networkId = await web3.eth.net.getId();
    const contract = new web3.eth.Contract(
        CarSales.abi,
        CarSales.networks[networkId].address
    );
    web3.eth.accounts.wallet.add(privateKey);
    
    const carName = carInfo.carName
    const price = carInfo.price
    const tx = await contract.methods.addCar(carName,price);
    const gas = await tx.estimateGas({ from: address });
    const gasPrice = await web3.eth.getGasPrice();
    const data = tx.encodeABI();
    const nonce = await web3.eth.getTransactionCount(address);
    const receipt = await web3.eth.accounts.signTransaction(
        {
            to: contract.options.address,
            data,
            gas,
            gasPrice,
            nonce,
            chainId: networkId
        },
        privateKey
    );
    return receipt
}

export default GenerateCarReceipt