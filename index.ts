import fs from "fs"
import https from "https"
import * as dotenv from "dotenv"
import express from "express"
import helmet from "helmet"
dotenv.config()

import {healthcheckRoute} from './src/routes/routes'

const app = express()
const port: number = parseInt(process.env.PORT as string, 10) || 6000

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//routes
app.use('/api/v1', healthcheckRoute)

https.createServer({
    key:fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}, app).listen(port, ()=>{
    console.log(`server listening on https://localhost:${port}`)
})
