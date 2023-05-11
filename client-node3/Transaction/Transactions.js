import { addText, fetchText } from "../utils/IPFS_FileSystem.js"
import Contract from "./ContractInstance.js"

const addCar = async(privateKey,CarInfo,OwnerID) => {
    const contract = Contract(privateKey)
    const carName = CarInfo.carName
    const price = CarInfo.price
    const index = await (await contract).methods.carIndex().call()
    console.log(`index : ${index}`)
    const receipt = await (await contract).methods.addCar(carName, price).send({ from: OwnerID })
    const transactionHash = receipt.transactionHash
    console.log(`Transaction hash: ${transactionHash}`)
    const data = transactionHash + " " + index
    const cid = await addText(data)
    return cid
}

const fetchTransactionDetails = async(cid) => {
    const contract = Contract()
    const data = await fetchText(cid)
    console.log(data)
    const array = data.split(" ")
    const transactionHash = array[0]
    const index = array[1];
    const carObj = await (await contract).methods.cars(index).call()
    const transactionObject = {
        transactionHash: transactionHash,
        carObj
    }
    return transactionObject
}


export { addCar, fetchTransactionDetails }

