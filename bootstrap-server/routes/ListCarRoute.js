import { Router } from 'express';
import bootstrapNode from '../utils/BootstrapNode.js';
import FETCH_CPU_LOAD from '../utils/CPULoad.js';
const router = Router();

router.post("/", async(req, res) => {
    const obj = req.body
    const peer = await FETCH_CPU_LOAD()
    bootstrapNode.libp2p.pubsub.publish(`PEER_${peer}_CHECK`, new TextEncoder().encode(JSON.stringify(obj)))
    bootstrapNode.libp2p.pubsub.subscribe(`PEER_${peer}_CHECKED_CAR`)
    // subscription listener
    bootstrapNode.libp2p.pubsub.addEventListener('message', (msg) => {
        const topic = msg.detail.topic;
        switch (topic) {
            case `PEER_${peer}_CHECKED_CAR`:
                const message = new TextDecoder().decode(msg.detail.data)
                res.send({ msg: message})
                break;
        }
    })
})

export { router }