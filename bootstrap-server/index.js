import express from "express"
import cors from "cors"
import { exec } from 'child_process'
import bootstrapNode from './utils/BootstrapNode.js'
import Subscribe from './libp2p/Subscribe.js'

import {router as AddCarRouter} from "./routes/AddCarRoute.js"
import {router as ListCarRouter} from "./routes/ListCarRoute.js"

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/addcar', AddCarRouter)
app.use('/listcar', ListCarRouter)

app.listen(9002, () => {
    console.log("Server Listening on PORT 9002")
})

const multiaddrs = bootstrapNode.libp2p.getMultiaddrs()
exec(`echo ${multiaddrs[1].toString()} > ../server-settings/settings.txt`, function (error, stdOut, stdErr) {
    if (error) console.log(error);
    if (stdErr) console.log(stdErr);
});
// function test() {
//     let cnt = 0
//     setInterval(async () => {
//         console.log(`${cnt}: `, bootstrapNode.libp2p.getPeers())
//         const peer = await FETCH_CPU_LOAD()
//         console.log(peer)
//         cnt++;
//     }, 3000)
// }
// test()
//pubsub subscribe
Subscribe()
// routes
