import { createHelia } from 'helia'
import { createLibp2p } from 'libp2p'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { tcp } from '@libp2p/tcp'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { exec } from 'child_process'
import express from "express"
import cors from "cors"
import { generateKeyPair } from 'crypto'

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.listen(9002, () => {
    console.log("Server Listening on PORT 9002")
})


async function createNode() {
    // the blockstore is where we store the blocks that make up files
    const blockstore = new MemoryBlockstore()

    // application-specific data lives in the datastore
    const datastore = new MemoryDatastore()

    // libp2p is the networking layer that underpins Helia
    const libp2p = await createLibp2p({
        datastore,
        pubsub: gossipsub({allowPublishToZeroPeers: true}),
        addresses: {
            listen: [
                '/ip4/0.0.0.0/tcp/0'
            ]
        },
        transports: [
            tcp()
        ],
        connectionEncryption: [
            noise()
        ],
        streamMuxers: [
            yamux()
        ],
    })

    return await createHelia({
        datastore,
        blockstore,
        libp2p,
    })
}

// create three helia nodes
const bootstrapNode = await createNode()

// connect them together
const multiaddrs = bootstrapNode.libp2p.getMultiaddrs()
exec(`echo ${multiaddrs[1].toString()} > ../server-settings/settings.txt`, function (error, stdOut, stdErr) {
    if (error) console.log(error);
    if (stdErr) console.log(stdErr);
});

let cnt = 0;
let CPU_LOAD
const FETCH_CPU_LOAD = (() => {
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
            console.log("No Peers connected")
        } else {     
            console.log(`Peer with least CPU Load is ${peer} with average load of ${load}`)
        }
    },3000)
})
function test() {
    setInterval(() => {
        console.log(`${cnt}: `, bootstrapNode.libp2p.getPeers())
        FETCH_CPU_LOAD()
        cnt++;
    }, 4000)

}
// test()
bootstrapNode.libp2p.pubsub.subscribe("NEW_PEER")
bootstrapNode.libp2p.pubsub.subscribe("CPU_LOAD")
bootstrapNode.libp2p.pubsub.addEventListener('message', (msg) => {
    const topic = msg.detail.topic;
    switch (topic) {
        case "NEW_PEER":
            const peerID = new TextDecoder().decode(msg.detail.data)
            bootstrapNode.libp2p.pubsub.publish("PEER_ADDED", new TextEncoder().encode(peerID))
            break;

        case "CPU_LOAD":
            const data = new TextDecoder().decode(msg.detail.data)
            const arr = data.split(" ")
            const peer = arr[0], load = arr[1]
            CPU_LOAD.push({
                peerID: peer,
                cpuLoad : load
            })
            break;
        default:
            console.log("default")
            break
    }
})
