import node from "../utils/Node.js"
import { multiaddr } from '@multiformats/multiaddr'
import os from 'os'

const Subscribe = () => {
    // subscribe to topics
    node.libp2p.pubsub.subscribe("PEER_ADDED")
    node.libp2p.pubsub.subscribe("FETCH_CPU_LOAD")
    node.libp2p.pubsub.subscribe(`PEER_${node.libp2p.peerId.toString()}`)

    // listener for subscribed topics
    node.libp2p.pubsub.addEventListener('message', (msg) => {
        const topic = msg.detail.topic;
        switch (topic) {
            case "PEER_ADDED":
                const id = new TextDecoder().decode(msg.detail.data)
                const addrs = multiaddr(id);
                if (node.libp2p.getMultiaddrs()[1].toString() == id) {
                    return;
                }
                else node.libp2p.dial(addrs)
                break;

            case "FETCH_CPU_LOAD":
                const cpuLoad = os.loadavg();
                console.log('CPU load is ' + cpuLoad[0]);
                node.libp2p.pubsub.publish("CPU_LOAD", new TextEncoder().encode(node.libp2p.peerId.toString() + " " + cpuLoad[0]))
                break;
            case `PEER_${node.libp2p.peerId.toString()}`:
                console.log(new TextDecoder().decode(msg.detail.data))
                break;
            default:
                console.log("default")
                break;
        }

    })
}
export default Subscribe