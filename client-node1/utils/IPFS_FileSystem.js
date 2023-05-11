import { unixfs } from '@helia/unixfs'
import node from './Node.js'

// create a filesystem on top of Helia, in this case it's UnixFS
const fs = unixfs(node)

const addText = (async (text) => {
    const encoder = new TextEncoder()
    const cid = await fs.addBytes(encoder.encode(text))
    console.log('Added file:', cid.toString())
    return cid
})

const fetchText = (async (cid) => {
    const decoder = new TextDecoder()
    let text = ''

    for await (const chunk of fs.cat(cid)) {
        text += decoder.decode(chunk, {
            stream: true
        })
    }
    console.log(`Fetched file contents on ${node.libp2p.peerId} :`, text)
    return text
})

export {addText, fetchText}