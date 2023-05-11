import bootstrapNode from "../utils/BootstrapNode.js";
const Subscribe = () => {

    // subscribe topics
    bootstrapNode.libp2p.pubsub.subscribe("NEW_PEER")
    bootstrapNode.libp2p.pubsub.subscribe("CPU_LOAD")

    // subscription listener
    bootstrapNode.libp2p.pubsub.addEventListener('message', (msg) => {
        const topic = msg.detail.topic;
        switch (topic) {
            case "NEW_PEER":
                const peerID = new TextDecoder().decode(msg.detail.data)
                bootstrapNode.libp2p.pubsub.publish("PEER_ADDED", new TextEncoder().encode(peerID))
                break;
            default:
                console.log("default")
                break
        }
    })
}

export default Subscribe