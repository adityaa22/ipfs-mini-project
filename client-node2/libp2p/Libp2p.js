import { createLibp2p } from 'libp2p'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { tcp } from '@libp2p/tcp'
import { bootstrap } from '@libp2p/bootstrap'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { promisify } from 'util'
import { exec } from 'child_process'
import { datastore } from './DataBlockStore.js'
const execute = promisify(exec)

const serverID = await execute(`cat ../server-settings/settings.txt`)

// libp2p is the networking layer that underpins Helia
const libp2p = await createLibp2p({
    datastore : datastore,
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

export default libp2p