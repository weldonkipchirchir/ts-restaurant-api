import express, {Request, Response} from 'express'

export const healthcheckRoute = express.Router()

healthcheckRoute.get('/healthcheck', (req: Request, res:Response)=>{
    const status = {status:"UP"}
    res.status(200).send(status);
})



