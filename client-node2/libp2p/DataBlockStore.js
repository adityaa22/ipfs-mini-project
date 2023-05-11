import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'

// the blockstore is where we store the blocks that make up files
const blockstore = new MemoryBlockstore()
// application-specific data lives in the datastore
const datastore = new MemoryDatastore()

export {blockstore , datastore}