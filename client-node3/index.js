import { createHelia } from 'helia'
import { createLibp2p } from 'libp2p'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { tcp } from '@libp2p/tcp'
import { bootstrap } from '@libp2p/bootstrap'
import { unixfs } from '@helia/unixfs'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { promisify } from 'util'
import { exec } from 'child_process'
import { multiaddr } from '@multiformats/multiaddr'
import os from 'os'

const execute = promisify(exec)

const serverID = await execute(`cat ../server-settings/settings.txt`)
async function createNode() {

    // the blockstore is where we store the blocks that make up files
    const blockstore = new MemoryBlockstore()

    // application-specific data lives in the datastore
    const datastore = new MemoryDatastore()

    // libp2p is the networking layer that underpins Helia
    const libp2p = await createLibp2p({
        datastore,
        pubsub: gossipsub({ allowPublishToZeroPeers: true }),
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
        peerDiscovery: [
            bootstrap({
                list: [
                    `${serverID.stdout}`,
                ]
            })
        ]
    })

    return await createHelia({
        datastore,
        blockstore,
        libp2p,
    })
}

// create three helia nodes
const node = await createNode();
// console.log(node.libp2p.getMultiaddrs)
setTimeout(() => {
    node.libp2p.pubsub.publish("NEW_PEER", new TextEncoder().encode(node.libp2p.getMultiaddrs()[1].toString()))
}, 6000)

// create a filesystem on top of Helia, in this case it's UnixFS
const fs = unixfs(node)

// we will use this TextEncoder to turn strings into Uint8Arrays
const encoder = new TextEncoder()

// add the bytes to your node and receive a unique content identifier
const addText = (async (text) => {
    const cid = await fs.addBytes(encoder.encode(text))
    console.log('Added file:', cid.toString())
    return cid
})
// const cid = await addText('Hello from node 3')
// console.log(cid)

function test() {
    let cnt = 0
    setInterval(() => {
        console.log(`${cnt}: `, node.libp2p.getPeers())
        cnt++;
    }, 3000)

}
test()
const fetchText = (async (cid) => {
    const decoder = new TextDecoder()
    let text = ''

    // use the second Helia node to fetch the file from the first Helia node
    for await (const chunk of fs.cat(cid)) {
        text += decoder.decode(chunk, {
            stream: true
        })
    }
    console.log(`Fetched file contents on ${node.libp2p.peerId} :`, text)
    // return text
})
node.libp2p.pubsub.subscribe("PEER_ADDED")
node.libp2p.pubsub.subscribe("FETCH_CPU_LOAD")
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
        default:
            console.log("default")
            break
    }

})
fetchText("bafkreigfmibbp6wfn7nq5ku3rdhk5td2cl5hbbkszmzrn6nxtwsjqpj5cm");
