import Web3 from 'web3';
import { addText, fetchText } from "../utils/IPFS_FileSystem.js"
import Contract from "./ContractInstance.js"

const addCar = async (receipt) => {
    const web3 = new Web3(process.env.NODE_ENDPOINT)
    const contract = Contract()
    const index = await (await contract).methods.carIndex().call()
    console.log(`index : ${index}`)
    const transaction = await web3.eth.sendSignedTransaction(receipt.rawTransaction);
    const transactionHash = transaction.transactionHash
    console.log(`Transaction hash: ${transactionHash}`)
    const data = transactionHash + " " + index
    const cid = await addText(data)
    return cid
}

const fetchTransactionDetails = async(cid) => {
    const contract = Contract()
    const data = await fetchText(cid)
    const array = data.split(" ")
    const transactionHash = array[0]
    const index = array[1];
    const carObj = await (await contract).methods.cars(index).call()
    const transactionObject = {
        transactionHash: transactionHash,
        OwnerID: carObj.owner,
        Model: carObj.model,
        Price: carObj.price,
    }
    return transactionObject
}

const test = async() => {
    const contract = Contract()
    const obj = await (await contract).methods.cars(1).call()
    return obj
}

export { addCar, fetchTransactionDetails, test }

