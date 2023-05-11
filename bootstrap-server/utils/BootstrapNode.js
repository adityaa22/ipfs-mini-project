import { createHelia } from 'helia'
import { blockstore, datastore } from '../libp2p/DataBlockStore.js';
import libp2p from '../libp2p/Libp2p.js'

async function createNode() {
    return await createHelia({
        datastore: datastore,
        blockstore: blockstore,
        libp2p: libp2p,
    })
}
const bootstrapNode = await createNode();

export default bootstrapNode

