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
import Web3 from 'web3';
import Provider from '@truffle/hdwallet-provider';
import CarSales from './build/contracts/CarSales.json' assert { type: "json" };
const address = '0xD41D2044B46423201E15d6F82B5E9C307EbD6882'
const privateKey = "6374b73cbf314cb58b49a060bf54c4022105b95904f8a335f6202a023a20d8eb"
const provider = new Provider(privateKey, 'https://sepolia.infura.io/v3/a5ad7a45de4c46acace6d69728f2a494');

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
        pubsub: gossipsub({allowPublishToZeroPeers:true}),
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
},6000)

// create a filesystem on top of Helia, in this case it's UnixFS
const fs = unixfs(node)

// we will use this TextEncoder to turn strings into Uint8Arrays
const encoder = new TextEncoder()

// add the bytes to your node and receive a unique content identifier
const addText = (async(text) => {
    const cid = await fs.addBytes(encoder.encode(text))
    console.log('Added file:', cid.toString())
    return cid
})
// const cid = await addText('Hello')
// console.log(cid)

function test() {
    let cnt = 0
    setInterval(() => {
        console.log(`${cnt}: `, node.libp2p.getPeers())
        cnt++;
    }, 3000)

}
// test()
const fetchText = (async(cid) => {
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
node.libp2p.pubsub.subscribe(`PEER_${node.libp2p.peerId.toString()}`)
node.libp2p.pubsub.addEventListener('message', (msg) => {
    const topic = msg.detail.topic;
    switch (topic) {
        case "PEER_ADDED" :
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
// fetchText("bafkreiayl6g3gitr7ys7kyng7sjywlrgimdoymco3jiyab6rozecmoazne");

let obj
const Transaction = async () => {
    console.log("here")
    const web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();
    const contract = new web3.eth.Contract(
        CarSales.abi,
        CarSales.networks[networkId].address
    );

    const receipt = await contract.methods.addCar("Jaguar", 1).send({ from: address })
    console.log(`Transaction hash: ${receipt.transactionHash}`);
    
    obj = await contract.methods.cars(2).call();
    console.log(obj)
    
}

// Transaction()
const transactionId = '0x4f59887a8693cbc69900e96fd0e5438b1e2fed521d8e3a0e5c184481a5f7769b'
const fetchTransaction = async () => {
    const web3 = new Web3(provider)
    const transaction = await web3.eth.getTransaction(transactionId);
    console.log(transaction)
}

// fetchTransaction()