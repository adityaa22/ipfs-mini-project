import dotenv from 'dotenv'
import node from './utils/Node.js';
import { addCar, fetchTransactionDetails } from './Transaction/Transactions.js';
import Subscribe from './libp2p/Subscribe.js';

dotenv.config()

setTimeout(() => {
    node.libp2p.pubsub.publish("NEW_PEER", new TextEncoder().encode(node.libp2p.getMultiaddrs()[1].toString()))
},6000)


function test() {
    let cnt = 0
    setInterval(() => {
        console.log(`${cnt}: `, node.libp2p.getPeers())
        cnt++;
    }, 3000)
}
test()
Subscribe()
console.log("working...")
// const cid = addCar("aa18ef0a175e1830aeb712f6ab5eeaefe6c43d2223455da2879ac8a9d198a959", { carName: "Audi", price: 1 }, "0xf680a56e1e408E78C236e2eD8A639fAD87BDC27c")
// console.log(cid)
// const data = fetchTransactionDetails("bafkreiawba6n5dmycoutfdvdmzzv7flqrtjfppnzts25gsbam3zjwy7x7a")
// // const obj = await test()
// console.log(data)