import dotenv from 'dotenv'
import node from './utils/Node.js';
import Subscribe from './libp2p/Subscribe.js';

dotenv.config()

setTimeout(() => {
    node.libp2p.pubsub.publish("NEW_PEER", new TextEncoder().encode(node.libp2p.getMultiaddrs()[1].toString()))
},6000)

Subscribe()
console.log("working...")
