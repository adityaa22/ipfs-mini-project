import bootstrapNode from "./BootstrapNode.js"
const FETCH_CPU_LOAD = (() => {

    let CPU_LOAD = []
    bootstrapNode.libp2p.pubsub.addEventListener('message', (msg) => {
        const topic = msg.detail.topic;
        switch (topic) {
            case "CPU_LOAD":
                const data = new TextDecoder().decode(msg.detail.data)
                const arr = data.split(" ")
                const peer = arr[0], load = arr[1]
                CPU_LOAD.push({
                    peerID: peer,
                    cpuLoad: load
                })
                break;
        }
    })
    return new Promise((resolve, reject) => {
        CPU_LOAD = []
        bootstrapNode.libp2p.pubsub.publish("FETCH_CPU_LOAD")
        setTimeout(() => {
            let peer, load = 100
            CPU_LOAD.forEach(e => {
                if (e.cpuLoad < load) {
                    peer = e.peerID
                    load = e.cpuLoad
                }
            });
            console.log(CPU_LOAD)
            if (load === 100) {
                resolve("NO PEERS")
                return
            }
            // bootstrapNode.libp2p.pubsub.publish(`PEER_${peer}`, new TextEncoder().encode("hey peer"))
            console.log(`Peer with least CPU Load is ${peer} with average load of ${load}`)
            resolve(peer)
        },2000);
    });
})

export default FETCH_CPU_LOAD