import { Router } from 'express';
import bootstrapNode from '../utils/BootstrapNode.js';
import FETCH_CPU_LOAD from '../utils/CPULoad.js';
const router = Router();

router.post("/", async(req, res) => {
    const obj = req.body
    const peer = await FETCH_CPU_LOAD()
    bootstrapNode.libp2p.pubsub.publish(`PEER_${peer}_ADD`, new TextEncoder().encode(JSON.stringify(obj)))
    bootstrapNode.libp2p.pubsub.subscribe(`PEER_${peer}_ADDED_CAR`)
    // subscription listener
    bootstrapNode.libp2p.pubsub.addEventListener('message', async (msg) => {
        const topic = msg.detail.topic;
        switch (topic) {
            case `PEER_${peer}_ADDED_CAR`:
                const cid = new TextDecoder().decode(msg.detail.data)
                res.send({ cid: cid })
                return;
        }
    })
})

export { router }