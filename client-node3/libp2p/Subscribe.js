import node from "../utils/Node.js"
import { multiaddr } from '@multiformats/multiaddr'
import os from 'os'
import { addCar, fetchTransactionDetails } from "../Transaction/Transactions.js"

const Subscribe = () => {
    // subscribe to topics
    node.libp2p.pubsub.subscribe("PEER_ADDED")
    node.libp2p.pubsub.subscribe("FETCH_CPU_LOAD")
    node.libp2p.pubsub.subscribe(`PEER_${node.libp2p.peerId.toString()}_ADD`)
    node.libp2p.pubsub.subscribe(`PEER_${node.libp2p.peerId.toString()}_CHECK`)

    // listener for subscribed topics
    node.libp2p.pubsub.addEventListener('message', async (msg) => {
        const topic = msg.detail.topic;
        switch (topic) {
            case "PEER_ADDED":
                const id = new TextDecoder().decode(msg.detail.data)
                const addrs = multiaddr(id);
                if (node.libp2p.getMultiaddrs()[1].toString() == id) {
                    return;
                }
                else node.libp2p.dial(addrs)
                console.log(node.libp2p.getPeers())
                break;

            case "FETCH_CPU_LOAD":
                const cpuLoad = os.loadavg();
                console.log('CPU load is ' + cpuLoad[0]);
                node.libp2p.pubsub.publish("CPU_LOAD", new TextEncoder().encode(node.libp2p.peerId.toString() + " " + cpuLoad[0]))
                break;
            case `PEER_${node.libp2p.peerId.toString()}_ADD`:
                console.log(`adding car details to chain...`)
                const obj = JSON.parse(new TextDecoder().decode(msg.detail.data))
                const OwnerID = obj.OwnerID
                const Model = obj.Model
                const Price = obj.Price
                const PrivateKey = obj.PrivateKey
                const cid = await addCar(PrivateKey, { carName: Model, price: Price }, OwnerID)
                node.libp2p.pubsub.publish(`PEER_${node.libp2p.peerId.toString()}_ADDED_CAR`, new TextEncoder().encode(cid))
                break;
            case `PEER_${node.libp2p.peerId.toString()}_CHECK`:
                const transaction = JSON.parse(new TextDecoder().decode(msg.detail.data))
                const owner = transaction.OwnerID
                const TransactionID = transaction.TransactionID
                console.log(`validating transaction Details...`)
                const data = await fetchTransactionDetails(TransactionID)
                let message
                console.log(`revieved OwnerID: ${owner}`)
                console.log(`Found OwnerID: ${data.OwnerID}`)
                if (data.OwnerID === owner) message = "successfully validated"
                else message = "validation failed"
                console.log(`status : ${message}`)
                node.libp2p.pubsub.publish(`PEER_${node.libp2p.peerId.toString()}_CHECKED_CAR`, new TextEncoder().encode(message))
                break;
        }

    })
}
export default Subscribe