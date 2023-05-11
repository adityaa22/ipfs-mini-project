import { fetchTransactionDetails } from "./Transactions.js"

const ValidateTransaction = (OwnerId, cid) => {
    const transactionObject = fetchTransactionDetails(cid)
    console.log(transactionObject)
}

export default ValidateTransaction